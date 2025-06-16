const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const sales_contact = asyncHandler( async(req, res) => {
    try {
        const { fullname, email, message } = req.body

        if (!fullname || !email || !message) {
            res.json({ type: "error", message: "Inputs are invalid" })
            return
        }
        
        let transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.INFO_EMAIL,
                pass: process.env.INFO_PASSWORD,
            },
        });
        
        var mailOptions = {
            from: `SDS INFO <customer-info@smartdevsystems.com>`,
            to: 'info@smartdevsystems.com',
            subject: 'New Contact Request',
            text: `${fullname} (${email}) sent the following message:\n\n${message}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json({
                    type:'error',
                    message: 'Mail sending failed'
                });
                return
            }
    
            if(info){
                res.json({
                    type:'success',
                    message: 'Mail was sent successfully'
                })
            }
        });
    } catch (error) {
        console.error(error)
    }
})

const enquiry_contact = asyncHandler( async(req, res) => {
    try {
        const { fullname, email, product, message } = req.body

        if (!fullname || !email || !product || !message) {
            res.json({ type: "error", message: "Inputs are invalid" })
            return
        }
        
        let transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SALES_EMAIL,
                pass: process.env.SALES_PASSWORD,
            },
        });
        
        var mailOptions = {
            from: `SDS ENQUIRY <customer-sales@smartdevsystems.com>`,
            to: 'sales@smartdevsystems.com',
            subject: 'New Product Enquiry',
            text: `${fullname} (${email}) inquired about ${product}:\n\n${message}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json({
                    type:'error',
                    message: 'Mail sending failed',
                    error
                });
                return
            }
    
            if(info){
                res.json({
                    type:'success',
                    message: 'Mail was sent successfully'
                })
            }
        });
    } catch (error) {
        console.error(error)
    }
})

module.exports = { sales_contact, enquiry_contact }