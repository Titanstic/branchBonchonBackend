const poolQuery = require("../../misc/poolQuery");

const insertNotification = async (title, description) => {
    const { rowCount } = await poolQuery(`
        INSERT INTO notifications(title, description) 
        VALUES ($1, $2)
    `, [title, description]);

    if(rowCount === 0){
        throw new Error("Insert Notification has been Error");
    }else{
        console.log(`notificationModel [insertNotification] rowCount:`, rowCount);
    }
};

module.exports = { insertNotification };