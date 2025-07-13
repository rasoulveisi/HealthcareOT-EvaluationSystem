export interface IHouseNumber {
  city: string;
  houseNumbers: number[];
  municipality: string;
  postalCode: string;
  province: string;
  street: string;
}

export interface IAddressUID {
  addressId: number;
  houseNumber: number;
  houseNumberAdd: string | null;
  fullAddress: string;
}

export interface IAddressOptions {
  street?: string;
  city?: string;
  houseNumber?: string;
  houseNumbers?: string[];
  houseNumberAddition?: string;
  houseNumberAdditions?: string[];
  address?: string;
}

// Mock data for address validation (simulating API responses)
export const MOCK_POSTAL_CODES: { [key: string]: IHouseNumber } = {
  '12345': {
    street: 'Main Street',
    city: 'Springfield',
    municipality: 'Springfield',
    postalCode: '12345',
    province: 'IL',
    houseNumbers: [1, 2, 3, 4, 5, 10, 15, 20]
  },
  '67890': {
    street: 'Oak Avenue',
    city: 'Madison',
    municipality: 'Madison',
    postalCode: '67890',
    province: 'WI',
    houseNumbers: [100, 102, 104, 106, 108, 110]
  },
  '54321': {
    street: 'Pine Road',
    city: 'Franklin',
    municipality: 'Franklin',
    postalCode: '54321',
    province: 'TN',
    houseNumbers: [25, 27, 29, 31, 33, 35]
  }
};

export const MOCK_ADDRESS_ADDITIONS: { [key: string]: string[] } = {
  '1': ['A', 'B'],
  '2': ['A'],
  '100': ['A', 'B', 'C'],
  '102': ['A', 'B'],
  '25': ['A'],
  '27': ['A', 'B']
};
