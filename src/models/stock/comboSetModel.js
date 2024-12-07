const poolQuery = require("../../../misc/poolQuery");

const getNormalMenuItemByComboId = async (comboSetId) => {
    const { rows: normalMenuItems } = await poolQuery(`
        SELECT 
            nmi.*,
            cmi.qty
        FROM normal_menu_items AS nmi
        LEFT JOIN combo_menu_items AS cmi
            ON nmi.id = cmi.normal_menu_item_id
        WHERE cmi.combo_set_id = $1;
    `, [comboSetId]);

    if(normalMenuItems.length === 0) throw new Error(`Combo Set not found by id.`);

    console.log(`comboSetModel [getNormalMenuItemByComboId] normalMenuItems: `, normalMenuItems);
    return normalMenuItems;
};

module.exports = { getNormalMenuItemByComboId };