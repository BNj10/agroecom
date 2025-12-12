'use client'

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getEquipmentRentalInfo, approveRental, rejectRental } from '@/lib/equipment-actions'

type RentalRequest = Awaited<ReturnType<typeof getEquipmentRentalInfo>>[number];

export interface RentalFormProps {
  rental?: RentalRequest;
}

export default function RentalForm({ rental }: RentalFormProps) {
  const router = useRouter() 
  const [action, setAction] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string>(rental?.status || 'pending');

  useEffect(() => {
    if (rental?.status) {
      setCurrentStatus(rental.status);
    }
  }, [rental?.status]);

  const formatDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    const dateObj = new Date(isoString);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const handleApprove = async () => {
    if (!rental || action || isRateLimited || currentStatus === 'approved') return;
    
    setAction('approve'); 
    setIsRateLimited(true);

    try {
      await approveRental(rental.id); 
      
      setCurrentStatus('approved');
      toast.success(`Request Approved!`);
      
      router.refresh(); 
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve request");
    } finally {
      setAction(null);
      setTimeout(() => setIsRateLimited(false), 1000);
    }
  };

  const handleReject = async () => {
    if (!rental || action || isRateLimited || currentStatus === 'rejected') return;
    
    setAction('reject');
    setIsRateLimited(true);

    try {
      await rejectRental(rental.id);
      
      setCurrentStatus('rejected');
      toast.success(`Request Rejected.`);

      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request");
    } finally {
       setAction(null);
       setTimeout(() => setIsRateLimited(false), 1000);
    }
  };

  if (!rental) {
    return (
      <Card className="shadow-lg p-6 w-full h-fit">
        <CardContent className="text-center py-10 text-muted-foreground">
          Waiting for rental details...
        </CardContent>
      </Card>
    );
  }

  const renter = rental.renter;
  const start = formatDateTime(rental.start_date);
  const end = formatDateTime(rental.end_date);

  return (
    <Card className="shadow-lg p-6 w-full h-fit">
      <CardTitle className="text-xl font-bold">
        Renter Details 
      </CardTitle>
      <CardContent className="p-0 pt-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="renterName">First Name</Label>
            <Input 
              id="renterName" 
              defaultValue={renter?.first_name || ''} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renterLastName">Last Name</Label>
            <Input 
              id="renterLastName" 
              defaultValue={renter?.last_name || ''} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renterEmail">Email</Label>
            <Input 
              id="renterEmail" 
              defaultValue={renter?.email || ''} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renterPhone">Contact Information</Label>
            <Input 
              id="renterPhone" 
              defaultValue={renter?.contact_number || 'N/A'} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryLocation">Delivery Location</Label>
            <Input 
              id="deliveryLocation" 
              defaultValue={rental.deliver_at || ''} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnLocation">Return Location</Label>
            <Input 
              id="returnLocation" 
              defaultValue={rental.return_at || ''} 
              readOnly 
              className="bg-muted" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate" 
              type="date" 
              defaultValue={start.date} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="startTime">Start Time</Label>
            <Input 
              id="startTime" 
              type="time" 
              defaultValue={start.time} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              type="date" 
              defaultValue={end.date} 
              readOnly 
              className="bg-muted" 
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="endTime">End Time</Label>
            <Input 
              id="endTime" 
              type="time" 
              defaultValue={end.time} 
              readOnly 
              className="bg-muted" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Comment or Message</Label>
          <Textarea 
            id="message" 
            defaultValue={rental.message || "No message provided."} 
            rows={4} 
            readOnly 
            className="resize-none bg-muted" 
          />
        </div>

          <div className="flex justify-end pt-4 space-x-4">
            <Button 
                className="w-40 font-semibold active:scale-95 transition-transform" 
                variant={currentStatus === 'approved' ? "outline" : "default"}
                disabled={action !== null || isRateLimited || currentStatus === 'approved'}
                onClick={handleApprove}
            >
              {action === 'approve' ? "Processing..." : (currentStatus === 'approved' ? "Approved" : "Approve")}
            </Button>
            
            <Button 
                className="w-40 font-semibold active:scale-95 transition-transform" 
                variant={currentStatus === 'rejected' ? "outline" : "destructive"}
                disabled={action !== null || isRateLimited || currentStatus === 'rejected'}
                onClick={handleReject}
            >
              {action === 'reject' ? "Processing..." : (currentStatus === 'rejected' ? "Rejected" : "Reject")}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}