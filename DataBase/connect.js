// ./DataBase/connect.js

const mongoose = require("mongoose");
const config = require("../config.js"); // استيراد ملف config.js

// تحديد الإعداد هنا
mongoose.set('strictQuery', false);

// استخدام بيانات الاتصال من ملف config.js
mongoose.connect(config.mongooseConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('connected mongoDB');
}).catch(console.error);

mongoose.connection.on('disconnected', () => console.log('-> lost connection'));
mongoose.connection.on('reconnect', () => console.log('-> reconnected'));
mongoose.connection.on('connected', () => console.log('-> connected'));
