import * as YUP from 'yup';
import data from '../mock/data.json';

const { accountValidation: {
    // firstName,
    // lastName,
    email,
    // username,
    // dateOfBirth,
    // address,
    // card: { 
    //     fields: {
    //         cardNumber,
    //         nameOnCard,
    //         expiryDate,
    //         cvv,
    //     }
    //  },
    // password,
    // phone,
} } = data;

// const phoneRegex = /^([+]?\d{1,4}[-\s]?|)\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
// const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

// const masterRegister = YUP.object().shape({
//     // [firstName.name]: YUP.string().required(firstName.reqErrorMessage),
//     // [lastName.name]: YUP.string().required(lastName.reqErrorMessage),
//     [email.name]: YUP.string().email().required(email.reqErrorMessage),
//     // [username.name]: YUP.string().email().required(username.reqErrorMessage),
//     // [phone.name]: YUP.string().required(phone.reqErrorMessage).matches(phoneRegex, phone.errorMessage),
//     [password.name]: YUP.string().required(password.reqErrorMessage).matches(passwordRegex, password.errorMessage),
// });

// const registerSubAccount = YUP.object().shape({
//     [firstName.name]: YUP.string().required(firstName.reqErrorMessage),
//     [lastName.name]: YUP.string().required(lastName.reqErrorMessage),
//     [email.name]: YUP.string().email().required(email.reqErrorMessage),
//     [phone.name]: YUP.string().required(phone.reqErrorMessage).matches(phoneRegex, phone.errorMessage),
//     [password.name]: YUP.string().required(password.reqErrorMessage).matches(passwordRegex, password.errorMessage),
// });

// const registerCard = YUP.object().shape({
//     [cardNumber.name]: YUP.number().required(cardNumber.reqErrorMessage).matches(phoneRegex, phone.errorMessage),
//     [nameOnCard.name]: YUP.string().required(nameOnCard.reqErrorMessage),
//     [cvv.name]: YUP.number().required(cvv.reqErrorMessage),
//     [expiryDate.name]: YUP.date().required(expiryDate.reqErrorMessage),
// });

const enquire = YUP.object().shape({
    [email.name]: YUP.string().email().required(email.reqErrorMessage),
    fullname: YUP.string().required("Name is required"),
    message: YUP.string().required("Message cannot be empty").min(50),
});

const contactUS = YUP.object().shape({
    fullname: YUP.string().required("Your fullname is required"),
    [email.name]: YUP.string().email().required(email.reqErrorMessage),
    message: YUP.string().required("Message cannot be empty").min(50),
});

const paymentMethod = YUP.object().shape({
    provider: YUP.string().required("Service provider name is required")
    .oneOf(["Airtel Money", "TNM Mpamba", "Mpamba", "Visa"], "Invalid provider. Provider must be Airtel Money, TNM Mpamba or Visa"),
    transid: YUP.string().required("Transaction ID is required"),
    fullname: YUP.string().required("Name is required"),
    amount: YUP.number().required("Amount is required").min(10000, "Amount must be MWK10,000 and above"),
    date: YUP.date().required("Transaction date is required"),
    screenshot: YUP.mixed().required("Transaction screenshot is required")
});

const newApi = YUP.object().shape({
    [email.name]: YUP.string().email().required(email.reqErrorMessage),
    apikey: YUP.string().required("API KEY is required"),
    scrtkey: YUP.string().required("Secret Key is required"),
});

export {
    contactUS,
    enquire,
    newApi,
    paymentMethod,
};