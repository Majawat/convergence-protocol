// test.js
import { Model } from "./js/models/Model.js";
import { Weapon } from "./js/models/Weapon.js";
import { SpecialRule } from "./js/models/SpecialRule.js";
import { Unit } from "./js/models/Unit.js";
import { Army } from "./js/models/Army.js";

function testUnitBasics() {
  console.log("=== Testing Unit Basics ===");
  const unit = new Unit({
    selectionId: "rQIWNXD",
    name: "Light Walker",
    size: 1,
  });
  console.log(unit);
}

console.log("Starting tests for OPR Army Tracker data models");

testUnitBasics();

console.log("\nAll tests completed!");
