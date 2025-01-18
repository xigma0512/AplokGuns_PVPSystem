import { EnchantmentType, EntityEquippableComponent, EquipmentSlot, ItemEnchantableComponent, world } from "@minecraft/server"
import {
    Container,
    ItemStack,
    EntityInventoryComponent,
    ItemLockMode,
    Player
} from "@minecraft/server"

import { ItemTable } from "./table"
import { Team } from "../../declare/enums"

import config from "../../config"

type WeaponIds = keyof typeof ItemTable.weapon

function getSpecialItem(slot: number) {
    const storage = world.getDimension('overworld').getBlock(config.special_item.container_position)
    const container = storage?.getComponent('inventory')?.container as Container
    return container.getItem(slot) as ItemStack
}

const giveWeapon = (target: Player, mainId: WeaponIds, pistolId: WeaponIds) => {

    const inventory = target.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;

    const weaponInfo = ItemTable.weapon[mainId].concat(ItemTable.weapon[pistolId])
    weaponInfo.forEach(item => {
        const [id, amount, slot] = item
        let itemStack = new ItemStack(id, amount)
        if (itemStack.typeId == "gabrielaplok:awp")
            itemStack = getSpecialItem(config.special_item.awp)

        itemStack.lockMode = ItemLockMode.inventory
        inventory.container?.setItem(slot, itemStack)

        target.sendMessage(JSON.stringify([id, amount, slot]))
    })
}

const giveArmor = (target: Player, team: Team) => {

    const equipment = target.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
    const armor = (team == Team.Blue ? config.special_item.blue_armor : config.special_item.red_armor)

    armor.forEach((slot, i) => {
        const itemStack = getSpecialItem(slot)

        itemStack.lockMode = ItemLockMode.slot
        const enchant = itemStack.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent
        enchant.addEnchantment({ level: 3, type: new EnchantmentType("unbreaking") })

        equipment.setEquipment([
            EquipmentSlot.Head,
            EquipmentSlot.Chest,
            EquipmentSlot.Legs,
            EquipmentSlot.Feet
        ][i], itemStack)
    })
}
export { giveWeapon, giveArmor }