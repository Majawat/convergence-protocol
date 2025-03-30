// test.js
import { Unit } from "./js/models/Unit.js";
import { Army } from "./js/models/Army.js";

function testUnitBasics() {
  console.log("=== Testing Unit Basics ===");
  const unit = new Unit({
    id: "rQIWNXD",
    cost: 165,
    name: "Light Walker",
    size: 1,
    bases: { round: "60", square: "50" },
    items: [],
    rules: [
      {
        id: "dIQ3SGl2J2Ew",
        name: "Fear",
        rating: 1,
        label: "Fear(1)",
      },
      {
        id: "a0YtInGiUDd6",
        name: "Tough",
        rating: "6",
        label: "Tough(6)",
      },
    ],
    valid: true,
    defense: 2,
    quality: 4,
    weapons: [
      {
        id: "LpKRMcio",
        name: "Rapid Heavy Flamer",
        type: "ArmyBookWeapon",
        range: 12,
        attacks: 2,
        weaponId: "LpKRMcio",
        specialRules: [
          {
            type: "ArmyBookRule",
            id: "17crjK7P6_w6",
            name: "AP",
            rating: 1,
            label: "AP(1)",
          },
          {
            type: "ArmyBookRule",
            id: "w_vX0mi58KKt",
            name: "Blast",
            rating: 3,
            label: "Blast(3)",
          },
          {
            type: "ArmyBookRule",
            id: "Zx4mWN0SbmK8",
            name: "Reliable",
            label: "Reliable",
          },
        ],
        label: 'Rapid Heavy Flamer (12", A2, AP(1), Blast(3), Reliable)',
        count: 1,
        originalCount: 1,
        dependencies: [
          {
            upgradeInstanceId: "WAQfRhMap",
            count: 1,
            variant: "replace",
          },
        ],
      },
      {
        id: "aGNIMwsb",
        name: "Stomp",
        type: "ArmyBookWeapon",
        range: 0,
        attacks: 2,
        weaponId: "hyB0WaAL",
        specialRules: [
          {
            type: "ArmyBookRule",
            id: "17crjK7P6_w6",
            name: "AP",
            rating: 1,
            label: "AP(1)",
          },
        ],
        label: "Stomp (A2, AP(1))",
        count: 1,
        originalCount: 1,
      },
    ],
    upgrades: ["G2", "63g9T"],
    hasCustomRule: false,
    disabledSections: [],
    hasBalanceInvalid: false,
    disabledUpgradeSections: [],
    armyId: "z65fgu0l29i4lnlu",
    xp: 3,
    notes: null,
    traits: [],
    combined: false,
    customName: "Longshanks",
    joinToUnit: null,
    selectionId: "7Sdeo",
    selectedUpgrades: [
      {
        instanceId: "sgTYjtK37",
        upgrade: {
          id: "NQfTQHF",
          uid: "bRN__",
          label: "Upgrade with one",
          parentPackageUid: "63g9T",
          type: "ArmyBookUpgradeSection",
          variant: "upgrade",
          select: { type: "exactly", value: 1 },
        },
        option: {
          uid: "Es6pZ",
          type: "ArmyBookUpgradeOption",
          costs: [
            { cost: 5, unitId: "rQIWNXD" },
            { cost: 5, unitId: "coX3WxC" },
          ],
          gains: [
            {
              name: "Rocket Salvo",
              type: "ArmyBookWeapon",
              count: 1,
              range: 18,
              attacks: 3,
              weaponId: "MGpXPp3r",
              specialRules: [
                {
                  id: "17crjK7P6_w6",
                  name: "AP",
                  type: "ArmyBookRule",
                  rating: 1,
                },
                {
                  id: "9042COVrLCsI",
                  name: "Limited",
                  type: "ArmyBookRule",
                },
              ],
              label: 'Rocket Salvo (18", A3, AP(1), Limited)',
              dependencies: [],
            },
          ],
          label: 'Rocket Salvo (18", A3, AP(1), Limited)',
          parentPackageUid: "63g9T",
          parentSectionUid: "bRN__",
          parentSectionId: "bRN__",
          id: "Es6pZ",
        },
      },
      {
        instanceId: "WAQfRhMap",
        upgrade: {
          id: "6pavGxd",
          uid: "EJjVx5L",
          label: "Replace Rapid Heavy Flamer",
          parentPackageUid: "G2",
          type: "ArmyBookUpgradeSection",
          variant: "replace",
          targets: ["Rapid Heavy Flamer"],
        },
        option: {
          uid: "X8u03PA",
          cost: 20,
          type: "ArmyBookUpgradeOption",
          costs: [{ cost: 20, unitId: "rQIWNXD" }],
          gains: [
            {
              id: "QpV-1C1l",
              name: "Rapid Heavy Machinegun",
              type: "ArmyBookWeapon",
              range: 30,
              attacks: 6,
              weaponId: "QpV-1C1l",
              specialRules: [{ id: "17crjK7P6_w6", name: "AP", rating: 1 }],
              label: 'Rapid Heavy Machinegun (30", A6, AP(1))',
              count: 1,
              dependencies: [],
            },
          ],
          label: 'Rapid Heavy Machinegun (30", A6, AP(1))',
          parentPackageUid: "G2",
          parentSectionUid: "EJjVx5L",
          parentSectionId: "EJjVx5L",
          id: "X8u03PA",
        },
      },
    ],
    loadout: [
      {
        id: "aGNIMwsb",
        name: "Stomp",
        type: "ArmyBookWeapon",
        range: 0,
        attacks: 2,
        weaponId: "hyB0WaAL",
        specialRules: [
          {
            type: "ArmyBookRule",
            id: "17crjK7P6_w6",
            name: "AP",
            rating: 1,
            label: "AP(1)",
          },
        ],
        label: "Stomp (A2, AP(1))",
        count: 1,
        originalCount: 1,
      },
      {
        name: "Rocket Salvo",
        type: "ArmyBookWeapon",
        count: 1,
        range: 18,
        attacks: 3,
        weaponId: "MGpXPp3r",
        specialRules: [
          {
            id: "17crjK7P6_w6",
            name: "AP",
            type: "ArmyBookRule",
            rating: 1,
          },
          { id: "9042COVrLCsI", name: "Limited", type: "ArmyBookRule" },
        ],
        label: 'Rocket Salvo (18", A3, AP(1), Limited)',
        dependencies: [],
      },
      {
        id: "QpV-1C1l",
        name: "Rapid Heavy Machinegun",
        type: "ArmyBookWeapon",
        range: 30,
        attacks: 6,
        weaponId: "QpV-1C1l",
        specialRules: [{ id: "17crjK7P6_w6", name: "AP", rating: 1 }],
        label: 'Rapid Heavy Machinegun (30", A6, AP(1))',
        count: 1,
        dependencies: [],
      },
    ],
  });
  console.log(unit);
}

console.log("Starting tests for OPR Army Tracker data models");

testUnitBasics();

console.log("\nAll tests completed!");
