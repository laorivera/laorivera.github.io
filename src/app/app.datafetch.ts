export interface ComputedStats {
    Health: number;
    MaxHealthBonus: number;
    ActionSpeed: number;
    RegularInteractionSpeed: number;
    MoveSpeed: number;
    MoveSpeedCalc: number;
    PhysicalPower: number;
    PhysicalPowerBonus: number;
    HealthRecovery: number;
    ManualDexterity: number;
    EquipSpeed: number;
    MagicalPower: number;
    MagicalPowerBonus: number;
    BuffDuration: number;
    MagicRating: number;
    MagicalDamageReduction: number;
    DebuffDuration: number;
    MemoryCapacity: number;
    MemoryCapacityBonus: number;
    SpellRecovery: number;
    SpellCastingSpeed: number;
    MagicalInteractionSpeed: number;
    Persuasiveness: number;
    CooldownReduction: number;
    PhysicalDamageReduction: number;
    SpellRecoveryBonus: number;
    PhysicalHealing: number;
    MagicalHealing: number;
    MemorySpellPayload: number;
    MemoryMusicPayload: number;
    UtilityEffectiveness: number;
    Luck: number;
    ArmorPenetration: number;
    MagicPenetration: number;
    HeadshotReduction: number;
    ProjectileReduction: number;
    FromArmorRating: number;
    BonusPhysicalDamageReduction: number;
    BonusMagicalDamageReduction: number;
    BonusPhysicalPower: number;
    BonusMagicalPower: number;
  }
  
  export interface Stats {
    Strength: number;
    Vigor: number;
    Agility: number;
    Dexterity: number;
    Will: number;
    Knowledge: number;
    Resourcefulness: number;
  }
  
  export interface CalculationResult {
    computedstats: ComputedStats;
    computedstatsweapon: ComputedWeaponStats;
    stats: Stats;
  }

  
  export interface WeaponStats {
    Attackone: number;
    Attacktwo: number;
    Attackthree: number;
    Attackfour: number;
}

export interface ComputedWeaponStats {
  PrimaryWeapon: WeaponStats;
  SecondaryWeapon: WeaponStats;
  PrimaryImpactPower: number;
  SecondaryImpactPower: number;
}