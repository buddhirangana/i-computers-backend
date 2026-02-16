import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {

        const passwordHash = bcrypt.hashSync(req.body.password, 10);


        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        });

        await newUser.save();

        res.json({
            message: "User Created Successfully"
        });
    } catch (error) {
        res.json({
            message: "Error Creating User"
        });
    }
}

export async function loginUser(req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (user == null) {
            res.status(404).json({
                message: "User Not Found"
            });
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (isPasswordCorrect) {
                // res.json({
                //     message: "Login Successful"
                // });
                const payload = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isBlocked: user.isBlocked,
                    isEmailVerified: user.isEmailVerified,
                    image : user.image
                };

                const token = jwt.sign(payload, "I-CoMputerS10Batch", {
                    expiresIn: "48h"
                });
                
                res.json({
                    token: token
                })

            } else {
                res.status(401).json({
                    message: "Invalid Password"
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error logging in user"
        });
    }
}

export function isAdmin(req, res, next) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized Access you need to login befor performing this action."
        })
        return;
    }

    if (req.user.isAdmin !== true) {
        res.status(403).json({
            message: "Access Denied. Admin only."
        });
        return;
    }

    next();
}