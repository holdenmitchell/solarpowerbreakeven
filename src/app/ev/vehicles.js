// Vehicle definitions for the EV cost comparison.
//
// The EV9 is fixed — it's the car we actually own, bought for $50,000.
// Comparison vehicles are the "what we'd have bought instead" alternatives;
// add to COMPARISON_VEHICLES to expand beyond the Sienna.
//
// Maintenance is modeled as recurring events rather than a flat per-mile rate
// so the mileage table can show which services land in each block. Costs are
// typical U.S. independent-shop estimates — unlike the fuel/energy side, they
// are NOT measured from actual records.

export const EV9 = {
  id: 'ev9',
  name: 'Kia EV9',
  shortName: 'EV9',
  year: 2026,
  trim: 'Wind AWD',
  type: 'ev',
  purchasePrice: 50000,
  purchaseNote: 'Actual price paid',
  milesPerKwh: 2.7, // measured from our own data — EPA rates the Wind AWD at 84 MPGe (~2.5 mi/kWh)
  image: '/cars/ev9.jpg',
  specs: [
    { label: 'Drivetrain', value: 'Electric AWD' },
    { label: 'Battery', value: '99.8 kWh' },
    { label: 'EPA range', value: '283 mi' },
    { label: 'Efficiency', value: '2.7 mi/kWh (measured)' },
    { label: 'Seating', value: '7' },
    { label: 'Oil changes', value: 'None' },
  ],
  maintenance: [
    {
      label: 'Tire rotation + inspection',
      intervalMiles: 8000,
      cost: 40,
      note: "Kia's primary EV9 service interval",
    },
    { label: 'Cabin air filter', intervalMiles: 20000, cost: 60 },
    { label: 'Brake fluid', intervalMiles: 48000, cost: 120, note: 'or 4 years' },
    { label: 'Tires (set of 4)', intervalMiles: 40000, cost: 1400, note: 'Heavier vehicle, higher load rating' },
    {
      label: 'Brake pads + rotors',
      intervalMiles: 100000,
      cost: 600,
      note: 'Regen braking greatly extends pad life',
    },
    {
      label: 'HV battery coolant',
      intervalMiles: 120000,
      cost: 250,
      note: 'or 10 years',
    },
  ],
};

export const SIENNA_2026_XLE = {
  id: 'sienna-2026-xle',
  name: 'Toyota Sienna Hybrid',
  shortName: 'Sienna',
  year: 2026,
  trim: 'XLE FWD',
  type: 'hybrid',
  // Expected starting price. MSRP for the 2026 XLE FWD is $46,615 (verified
  // August 2026); this rounds up toward a realistic transaction price.
  // AWD would add $2,000.
  purchasePrice: 47000,
  purchaseNote: '2026 XLE FWD starting price',
  mpg: 36, // EPA combined, FWD (AWD is 35)
  image: '/cars/sienna-2026.jpg',
  specs: [
    { label: 'Drivetrain', value: 'Hybrid' },
    { label: 'Efficiency', value: '36 mpg combined (EPA)' },
    { label: 'Seating', value: '8' },
    { label: 'Oil changes', value: 'Every 10,000 mi' },
  ],
  maintenance: [
    { label: 'Tire rotation', intervalMiles: 5000, cost: 40 },
    { label: 'Oil + filter', intervalMiles: 10000, cost: 85, note: '0W-16 full synthetic' },
    { label: 'Engine air filter', intervalMiles: 15000, cost: 60 },
    { label: 'Cabin air filter', intervalMiles: 15000, cost: 60 },
    { label: 'Brake fluid', intervalMiles: 30000, cost: 120 },
    { label: 'Tires (set of 4)', intervalMiles: 45000, cost: 900 },
    { label: 'Hybrid transaxle fluid', intervalMiles: 60000, cost: 200 },
    {
      label: 'Brake pads + rotors',
      intervalMiles: 80000,
      cost: 500,
      note: 'Regen braking extends pad life',
    },
    {
      label: 'Engine + inverter coolant',
      intervalMiles: 100000,
      cost: 300,
    },
    { label: 'Spark plugs', intervalMiles: 120000, cost: 300 },
  ],
};

export const COMPARISON_VEHICLES = [SIENNA_2026_XLE];

export const DEFAULT_COMPARISON = SIENNA_2026_XLE;
