import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';

import { 
  IHouseNumber, 
  IAddressUID, 
  MOCK_POSTAL_CODES, 
  MOCK_ADDRESS_ADDITIONS 
} from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() {}

  /**
   * Get house numbers by postal code
   * @param postalCode - The postal code to lookup
   * @returns Observable of house number data
   */
  getHouseNumberByPostCode(postalCode: string): Observable<IHouseNumber> {
    const addressData = MOCK_POSTAL_CODES[postalCode];
    
    if (addressData) {
      return of(addressData).pipe(delay(300));
    } else {
      // Return empty data for unknown postal codes
      const emptyData: IHouseNumber = {
        street: '',
        city: '',
        municipality: '',
        postalCode: postalCode,
        province: '',
        houseNumbers: []
      };
      return of(emptyData).pipe(delay(300));
    }
  }

  /**
   * Get address UIDs for a specific postal code and house number
   * @param postalCode - The postal code
   * @param houseNumber - The house number
   * @returns Observable of address UIDs
   */
  getAddressUids(postalCode: string, houseNumber: string): Observable<IAddressUID[]> {
    const additions = MOCK_ADDRESS_ADDITIONS[houseNumber] || [];
    const addressData = MOCK_POSTAL_CODES[postalCode];
    
    if (!addressData) {
      return of([]).pipe(delay(200));
    }

    const addressUids: IAddressUID[] = additions.map((addition, index) => ({
      addressId: parseInt(houseNumber) * 100 + index,
      houseNumber: parseInt(houseNumber),
      houseNumberAdd: addition,
      fullAddress: `${houseNumber}${addition} ${addressData.street}, ${addressData.city}, ${addressData.province} ${postalCode}`
    }));

    return of(addressUids).pipe(delay(200));
  }

  /**
   * Validate postal code format
   * @param postalCode - The postal code to validate
   * @returns Observable of validation result
   */
  validatePostalCode(postalCode: string): Observable<{ isValid: boolean; message?: string }> {
    // Simple validation - in reality this would be more sophisticated
    const isValid = /^\d{5}$/.test(postalCode);
    
    const result = {
      isValid,
      message: isValid ? undefined : 'Postal code must be 5 digits'
    };

    return of(result).pipe(delay(100));
  }

  /**
   * Get full address string
   * @param postalCode - The postal code
   * @param houseNumber - The house number
   * @param addition - The house number addition (optional)
   * @returns Observable of formatted address
   */
  getFullAddress(postalCode: string, houseNumber: string, addition?: string): Observable<string> {
    const addressData = MOCK_POSTAL_CODES[postalCode];
    
    if (!addressData) {
      return of('').pipe(delay(100));
    }

    const fullAddress = `${houseNumber}${addition || ''} ${addressData.street}, ${addressData.city}, ${addressData.province} ${postalCode}`;
    
    return of(fullAddress).pipe(delay(100));
  }

  /**
   * Search addresses by partial input
   * @param searchTerm - The search term
   * @returns Observable of matching addresses
   */
  searchAddresses(searchTerm: string): Observable<string[]> {
    const allAddresses: string[] = [];
    
    // Generate sample addresses from mock data
    Object.entries(MOCK_POSTAL_CODES).forEach(([postalCode, data]) => {
      data.houseNumbers.forEach(houseNumber => {
        const baseAddress = `${houseNumber} ${data.street}, ${data.city}, ${data.province} ${postalCode}`;
        allAddresses.push(baseAddress);
        
        // Add addresses with additions
        const additions = MOCK_ADDRESS_ADDITIONS[houseNumber.toString()] || [];
        additions.forEach(addition => {
          allAddresses.push(`${houseNumber}${addition} ${data.street}, ${data.city}, ${data.province} ${postalCode}`);
        });
      });
    });

    const filtered = allAddresses.filter(address => 
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filtered.slice(0, 10)).pipe(delay(200)); // Limit to 10 results
  }
}

