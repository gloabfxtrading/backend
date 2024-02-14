

const express = require("express");
const { userModel } = require("../models/UserModel");
const WithdrawModel = require("../models/Withdraw.Model");
const DepositModel = require("../models/adminDeposit.Model");
const BankModel = require("../models/BankDetails");
const WithdrawRequestRoute = express.Router();


const generateAccountNumber = async () => {
    const lastUser = await WithdrawModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let lastNumber = 0;

    if (lastUser) {
        const lastAccountNumber = lastUser.AcNumber;

        if (lastAccountNumber && lastAccountNumber.startsWith('WDR')) {
            lastNumber = parseInt(lastAccountNumber.substring(3), 10);
        }
    }

    let newNumber;
    do {
        newNumber = lastNumber + 1;
        const formattedNumber = newNumber.toString().padStart(6, '0');
        const newAcNumber = `WDR${formattedNumber}`;
        const existingUser = await WithdrawModel.findOne({ withdraw_id: newAcNumber });

        if (!existingUser) {
            return newAcNumber;
        }

        // If the generated account number already exists, try again with the next number
        lastNumber++;
    } while (true);
};


WithdrawRequestRoute.post('/:id/:account_number', async (req, res) => {
    try {
        const { withdraw_id, withdraw_money, remarks, status, created_at } = req.body;
        const user = await BankModel.findOne({ IDNumber: req.params.id, account_number: req.params.account_number });
        //    const existingDeposit=await DepositModel.findOne({AccountNo:req.params.id})

        const withdrawAccount = await generateAccountNumber();
        console.log(withdrawAccount)
        console.log('Before WithdrawModel.create');
        const new_withdraw = new WithdrawModel({
            IDNumber: user.IDNumber,
            nick_name: user.nick_name,
            full_name: user.full_name,
            bank_name: user.bank_name,
            ifsc_code: user.ifsc_code,
            account_number: user.account_number,
            branch_name: user.branch_name,
            city: user.city,
            country: user.country,
            currency: user.currency,
            withdraw_id: withdrawAccount,
            withdraw_money,
            remarks,
            status,
            created_at
        })
        console.log('After WithdrawModel.create');

        console.log('Before new_withdraw.save');
        const withdraw = await new_withdraw.save();
        console.log('After new_withdraw.save');
        return res.status(200).send({ msg: "Withdraw request sent", withdraw })
    } catch (error) {
        return res.status(200).send({ msg: "Unable to send" })
    }
})




WithdrawRequestRoute.put('/:id/:withdrawid', async (req, res) => {
    try {
        const { status } = req.body;
        const accountId = req.params.id;
        const withdrawId = req.params.withdrawid;
        const withdraw = await WithdrawModel.findOne({ IDNumber: accountId, withdraw_id: withdrawId });

        if (!withdraw) {
            return res.status(404).send({ msg: 'Withdrawal request not found' });
        }

        withdraw.status = status;
        await withdraw.save();

        if (status === "approved") {
            const existingDeposit = await userModel.findOne({ AcNumber: withdraw.IDNumber });

            if (existingDeposit) {
                if (existingDeposit.totalbalance >= withdraw.withdraw_money) {
                    existingDeposit.totalbalance -= withdraw.withdraw_money;
                    
                    // Save the updated deposit
                    await existingDeposit.save();
                } else {
                    return res.status(400).send({ msg: 'Insufficient balance in the account' });
                }
            } else {
                return res.status(404).send({ msg: 'Deposit not found for the user' });
            }
        }
        else if (status === "rejected") {
            const existingDeposit = await userModel.findOne({ AccountNo: withdraw.IDNumber });
            if (existingDeposit) {
                if (existingDeposit.totalbalance <= withdraw.withdraw_money) {
                    await existingDeposit.save();
                } else {
                    return res.status(400).send({ msg: 'Insufficient balance in the account' });
                }
            }
        }

        return res.status(200).send({ msg: `Withdrawal request status updated to ${status}` });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal server error" });
    }
});


WithdrawRequestRoute.get('/:id', async (req, res) => {
    try {
        if (req.params.id === "admin") {
            const withdraw = await WithdrawModel.find({  });
            return res.status(200).send(withdraw);
        }
        AccountNo = req.params.id;
        const withdraw = await WithdrawModel.find({ IDNumber: AccountNo });
        return res.status(200).send(withdraw);
    } catch (error) {
        return res.status(404).send({ msg: "Unable to fetch withdraw Details" });
    }
})


module.exports = WithdrawRequestRoute;

