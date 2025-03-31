// test.js
import { Unit } from "./js/models/Unit.js";
import { Army } from "./js/models/Army.js";

function testUnitBasics() {
  console.log("=== Testing Unit Basics ===");
  const unit = new Unit({
    id: "sF4ltO_",
    cost: 85,
    name: "High Destroyer Sister",
    size: 1,
    bases: { round: "40", square: "40" },
    items: [
      {
        id: "iny1D",
        name: "Combat Shield",
        type: "ArmyBookItem",
        bases: null,
        content: [
          {
            id: "wsqfB0fq69eG",
            name: "Shield Wall",
            type: "ArmyBookRule",
          },
        ],
        count: 1,
      },
    ],
    rules: [
      { id: "6mJw5IdqSqNC", name: "Ambush", label: "Ambush" },
      { id: "j_GPMzrugrCj", name: "Devout", label: "Devout" },
      { id: "T08VkBuVmNZ_", name: "Hero", label: "Hero" },
      {
        id: "a0YtInGiUDd6",
        name: "Tough",
        rating: 6,
        label: "Tough(6)",
      },
    ],
    valid: true,
    defense: 4,
    quality: 4,
    weapons: [
      {
        id: "hyYW2",
        name: "CCW",
        type: "ArmyBookWeapon",
        count: 1,
        range: 0,
        attacks: 4,
        weaponId: "KAsYqgPq",
        specialRules: [],
        label: "CCW (A4)",
        originalCount: 1,
        dependencies: [
          {
            upgradeInstanceId: "H_s3YO6Do",
            count: 1,
            variant: "replace",
          },
        ],
      },
    ],
    upgrades: ["qApWS", "B1"],
    hasCustomRule: false,
    hasBalanceInvalid: false,
    disabledUpgradeSections: [],
    armyId: "7oi8zeiqfamiur21",
    xp: 0,
    notes: null,
    traits: [],
    combined: false,
    customName: "Seraphine Calder",
    joinToUnit: "6S1v5",
    selectionId: "YLKIO",
    selectedUpgrades: [
      {
        instanceId: "bxGIcUOGe",
        upgrade: {
          id: "qIUcJQF",
          uid: "jDPiWW0",
          label: "Upgrade with one",
          isHeroUpgrade: true,
          parentPackageUid: "B1",
          type: "ArmyBookUpgradeSection",
          variant: "upgrade",
          select: { type: "exactly", value: 1 },
        },
        option: {
          uid: "se1bXdC",
          cost: 40,
          type: "ArmyBookUpgradeOption",
          costs: [
            { cost: 45, unitId: "sF4ltO_" },
            { cost: 45, unitId: "W-crN7f" },
            { cost: 45, unitId: "2TXWi3B" },
            { cost: 45, unitId: "_nVdDbE" },
          ],
          gains: [
            {
              name: "Witch",
              type: "ArmyBookItem",
              label: "Witch (Caster(2))",
              content: [
                {
                  id: "47CAqf7ySlfc",
                  name: "Caster",
                  type: "ArmyBookRule",
                  rating: 2,
                  dependencies: [],
                },
              ],
              count: 1,
              dependencies: [],
            },
          ],
          label: "Witch (Caster(2))",
          parentPackageUid: "B1",
          parentSectionUid: "jDPiWW0",
          parentSectionId: "jDPiWW0",
          id: "se1bXdC",
        },
      },
      {
        instanceId: "H_s3YO6Do",
        upgrade: {
          id: "FXf3Eu7",
          uid: "ok6yv",
          label: "Replace CCW",
          parentPackageUid: "qApWS",
          type: "ArmyBookUpgradeSection",
          variant: "replace",
          targets: ["CCW"],
        },
        option: {
          uid: "G1a7J",
          cost: 20,
          type: "ArmyBookUpgradeOption",
          costs: [{ cost: 25, unitId: "sF4ltO_" }],
          gains: [
            {
              name: "Energy Fist",
              type: "ArmyBookWeapon",
              count: 1,
              range: 0,
              attacks: 4,
              weaponId: "Syx54IfK",
              specialRules: [
                {
                  id: "17crjK7P6_w6",
                  name: "AP",
                  type: "ArmyBookRule",
                  rating: 4,
                },
              ],
              label: "Energy Fist (A4, AP(4))",
              dependencies: [],
            },
          ],
          label: "Energy Fist (A4, AP(4))",
          parentPackageUid: "qApWS",
          parentSectionUid: "ok6yv",
          parentSectionId: "ok6yv",
          id: "G1a7J",
        },
      },
    ],
    loadout: [
      {
        id: "iny1D",
        name: "Combat Shield",
        type: "ArmyBookItem",
        bases: null,
        content: [
          {
            id: "wsqfB0fq69eG",
            name: "Shield Wall",
            type: "ArmyBookRule",
          },
        ],
        count: 1,
      },
      {
        name: "Witch",
        type: "ArmyBookItem",
        label: "Witch (Caster(2))",
        content: [
          {
            id: "47CAqf7ySlfc",
            name: "Caster",
            type: "ArmyBookRule",
            rating: 2,
            dependencies: [],
            count: 1,
          },
        ],
        count: 1,
        dependencies: [],
      },
      {
        name: "Energy Fist",
        type: "ArmyBookWeapon",
        count: 1,
        range: 0,
        attacks: 4,
        weaponId: "Syx54IfK",
        specialRules: [
          {
            id: "17crjK7P6_w6",
            name: "AP",
            type: "ArmyBookRule",
            rating: 4,
          },
        ],
        label: "Energy Fist (A4, AP(4))",
        dependencies: [],
      },
    ],
  });
  console.log(unit);

  testModelBasics(unit);
}

function testModelBasics(unit) {
  console.log("=== Testing Model Basics ===");
  console.log(unit.getAllModels());
}

console.log("Starting tests for OPR Army Tracker data models");
testUnitBasics();

console.log("All tests completed!");
