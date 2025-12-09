'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PersonalInfoSkeleton from "../../../components/PersonalInfoSkeleton"
import PersonalInfo from "@/app/(main)/dashboard/components/PersonalInfo"
import AccountInformation from "@/app/(main)/dashboard/components/AccountInformation"


export default function UserProfileReadOnly() {

    const[loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
      }, [])
    
    const formData = {
        username: 'Benjie Tech',
        firstName: 'Nganou',
        lastName: 'Ngan',
        email: 'ngannou7@gmail.com',
        role: 'Lender',
        accountAge: '8 months',
        subscription: '5 year subscription'
    };

    const handleDeleteAccount = () => {
        console.log('Account deletion confirmed!');
        setIsDeleteDialogOpen(false); 
    };

    if(loading)
    {
        <PersonalInfoSkeleton />
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
                <PersonalInfo 
                    editable={false} 
                    initialData={{
                        username: formData.username,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                    }}
                />
                <AccountInformation 
                    initialData={{
                        role: formData.role,
                        accountAge: formData.accountAge,
                        subscription: formData.subscription,
                    }}
                />
                    <div className="pt-4">
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-full md:w-auto font-(--font-geist-sans) cursor-pointer"
                                >
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                            <div className="p-6">
                                <div className="mt-4 space-y-2">
                                    <DialogTitle className="text-lg font-semibold">Delete Account?</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500">
                                        Deleting your account is irreversible and will erase all the user&apos;s data. This action cannot be undone.
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50 space-x-2">
                                <Button 
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    variant="outline"
                                    className="font-(--font-geist-sans) cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleDeleteAccount}
                                    variant="destructive"
                                    className="font-(--font-geist-sans) cursor-pointer" 
                                >
                                    Continue
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}