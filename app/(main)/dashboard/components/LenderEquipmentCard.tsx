'use client'

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface LenderEquipmentCardProps {
  equipment?: {
    name: string;
    maker: string;
    owner: string;
    delivery: string;
    description: string;
    imageUrl?: string;
    rating: number;
    rentedCount: number;
    price: number;
  };
}

const mockEquipment = {
  name: 'Rice Harvester Pro',
  maker: 'LOVOL',
  owner: 'AgriTech Solutions',
  delivery: 'Pickup / Deliver within Ormoc City',
  description: 'High-performance rice harvester suitable for all rice field sizes.',
  imageUrl: '/Hero_bg.jpg',
  rating: 4.5,
  rentedCount: 1250,
  price: 2500,
};

export default function LenderEquipmentCard({ equipment: propEquipment }: LenderEquipmentCardProps) {
  const equipment = propEquipment || mockEquipment;

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="shadow-lg">
        <CardContent className="p-0">
          {/* Image */}
          <div className="w-full h-64 relative">
            <Image
              src={equipment.imageUrl || '/Hero_bg.jpg'}
              alt={equipment.name} 
              fill
              className="object-cover rounded-t-lg"
            />
          </div>

          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">{equipment.name}</h2>
            <p className="text-lg text-gray-600">{equipment.maker}</p>
            
            {/* Rating and Rented */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(equipment.rating) ? 'fill-current' : 'fill-none'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-700 font-semibold">{equipment.rating} Ratings</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-700">{equipment.rentedCount.toLocaleString()} rented</span>
            </div>
            
            <div className="text-2xl font-bold">
              ₱ {equipment.price.toLocaleString()}
            </div>
            
            {/* Additional Details Section */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <h3 className="text-lg font-bold">{equipment.name}</h3>
              <p className="text-sm">
                <span className="font-semibold">Maker:</span> {equipment.maker}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Owner:</span> {equipment.owner}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Delivery:</span> {equipment.delivery}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Description:</span> {equipment.description}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}