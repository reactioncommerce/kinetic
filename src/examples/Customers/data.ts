import { faker } from "@faker-js/faker";

export type Customer = {
  id: string
  address: {
    country: string
    state: string
    city: string
    street: string
  }
  createdAt: number
  email: string
  name: string
  phone: string
}

export const customers: Customer[] = [
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "West Virginia",
      city: "Parkersburg",
      street: "2849 Fulton Street"
    },
    createdAt: 1555016400000,
    email: "ekaterina.tankova@devias.io",
    name: "Ekaterina Tankova",
    phone: "304-428-3097"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Bristow",
      city: "Iowa",
      street: "1865  Pleasant Hill Road"
    },
    createdAt: 1555016400000,
    email: "cao.yu@devias.io",
    name: "Cao Yu",
    phone: "712-351-5711"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
      street: "4894  Lakeland Park Drive"
    },
    createdAt: 1555016400000,
    email: "alexa.richardson@devias.io",
    name: "Alexa Richardson",
    phone: "770-635-2682"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Ohio",
      city: "Dover",
      street: "4158  Hedge Street"
    },
    createdAt: 1554930000000,
    email: "anje.keizer@devias.io",
    name: "Anje Keizer",
    phone: "908-691-3242"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Texas",
      city: "Dallas",
      street: "75247"
    },
    createdAt: 1554757200000,
    email: "clarke.gillebert@devias.io",
    name: "Clarke Gillebert",
    phone: "972-333-4106"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "California",
      city: "Bakerfield",
      street: "317 Angus Road"
    },
    createdAt: 1554670800000,
    email: "adam.denisov@devias.io",
    name: "Adam Denisov",
    phone: "858-602-3409"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "California",
      city: "Redondo Beach",
      street: "2188  Armbrester Drive"
    },
    createdAt: 1554325200000,
    email: "ava.gregoraci@devias.io",
    name: "Ava Gregoraci",
    phone: "415-907-2647"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Nevada",
      city: "Las Vegas",
      street: "1798  Hickory Ridge Drive"
    },
    createdAt: 1523048400000,
    email: "emilee.simchenko@devias.io",
    name: "Emilee Simchenko",
    phone: "702-661-1654"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Michigan",
      city: "Detroit",
      street: "3934  Wildrose Lane"
    },
    createdAt: 1554702800000,
    email: "kwak.seong.min@devias.io",
    name: "Kwak Seong-Min",
    phone: "313-812-8947"
  },
  {
    id: faker.datatype.uuid(),
    address: {
      country: "USA",
      state: "Utah",
      city: "Salt Lake City",
      street: "368 Lamberts Branch Road"
    },
    createdAt: 1522702800000,
    email: "merrile.burgett@devias.io",
    name: "Merrile Burgett",
    phone: "801-301-7894"
  }
];
