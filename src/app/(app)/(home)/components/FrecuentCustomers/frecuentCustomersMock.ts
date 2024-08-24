import { Customer } from '@/definitions/entities'

interface FrecimentCustomersMock extends Customer {
	purchases: number;
}

export const frecuentCustomersMock: FrecimentCustomersMock[] = [
  {
    id: 1,
    name: 'John Doe',
    dni: '123456789',
    phone: '+5511999999999',
    purchases: 100,
  },
  {
    id: 2,
    name: 'Jane Doe',
    dni: '123456789',
    phone: '+5511999999999',
    purchases: 50,
  },
  {
    id: 3,
    name: 'John Doe',
    dni: '123456789',
    phone: '+5511999999999',
    purchases: 100,
  },
  {
    id: 4,
    name: 'Jane Doe',
    dni: '123456789',
    phone: '+5511999999999',
    purchases: 50,
  },
  {
    id: 5,
    name: 'John Doe',
    dni: '123456789',
    phone: '+5511999999999',
    purchases: 100,
	},
]
