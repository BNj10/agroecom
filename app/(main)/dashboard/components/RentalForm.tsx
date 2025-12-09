'use client'

import { useRouter } from "next/navigation"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRentals } from "@/contexts/RentalContext"

interface RenterDetails {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryLocation: string;
  returnLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  comment: string;
}

interface RentalFormProps {
  rentalId?: string;
  renter?: RenterDetails;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

const mockRenter: RenterDetails = {
  name: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+63 912 345 6789',
  deliveryLocation: 'Ormoc City, Leyte',
  returnLocation: 'Ormoc City, Leyte',
  startDate: '2025-12-15',
  startTime: '08:00',
  endDate: '2025-12-20',
  endTime: '17:00',
  comment: 'Please deliver in the morning. I will be available from 8 AM onwards.',
};

export default function RentalForm({ 
  rentalId,
  renter: propRenter, 
  onApprove, 
  onReject,
  showActions = true 
}: RentalFormProps) {
  const router = useRouter();
  const { getRentalById, updateRentalStatus } = useRentals();
  
  const contextRental = rentalId ? getRentalById(rentalId) : undefined;
  
  const renter = contextRental ? {
    name: contextRental.name,
    lastName: contextRental.lastName || '',
    email: contextRental.email,
    phone: contextRental.phone || '',
    deliveryLocation: contextRental.deliveryLocation || '',
    returnLocation: contextRental.returnLocation || '',
    startDate: contextRental.startDate || '',
    startTime: contextRental.startTime || '',
    endDate: contextRental.endDate || '',
    endTime: contextRental.endTime || '',
    comment: contextRental.comment || '',
  } : (propRenter || mockRenter);

  const handleApprove = () => {
    if (onApprove) {
      onApprove();
    } else if (rentalId) {
      updateRentalStatus(rentalId, 'approved');
      router.push('/dashboard/lender');
    } else {
      console.log('Approved!');
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    } else if (rentalId) {
      updateRentalStatus(rentalId, 'rejected');
      router.push('/dashboard/lender');
    } else {
      console.log('Rejected!');
    }
  };

  return (
    <Card className="shadow-lg p-6 w-full h-fit">
      <CardTitle className="text-xl font-bold">
        Renter Details
      </CardTitle>
      <CardContent className="p-0 pt-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="renterName">First Name</Label>
            <Input id="renterName" defaultValue={renter.name} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renterLastName">Last Name</Label>
            <Input id="renterLastName" defaultValue={renter.lastName} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renterEmail">Email</Label>
            <Input id="renterEmail" defaultValue={renter.email} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renterPhone">Contact Information</Label>
            <Input id="renterPhone" defaultValue={renter.phone} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryLocation">Delivery Location</Label>
            <Input id="deliveryLocation" defaultValue={renter.deliveryLocation} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnLocation">Return Location</Label>
            <Input id="returnLocation" defaultValue={renter.returnLocation} readOnly className="bg-muted" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" defaultValue={renter.startDate} type="date" readOnly className="bg-muted" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" defaultValue={renter.startTime} type="time" readOnly className="bg-muted" />
          </div>
          
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" defaultValue={renter.endDate} type="date" readOnly className="bg-muted" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" defaultValue={renter.endTime} type="time" readOnly className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Comment or Message</Label>
          <Textarea id="message" defaultValue={renter.comment} rows={4} readOnly className="resize-none bg-muted" />
        </div>

        {showActions && (
          <div className="flex justify-end pt-4 space-x-4">
            <Button 
              className="px-8 font-semibold"
              variant="default"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button 
              className="px-8 font-semibold"
              variant="destructive"
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}