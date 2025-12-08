export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    first_name: string;
    last_name: string,
    confirmed_at: string;
    address: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

export interface Equipment {
    id: string;
    name: string;
    model: string;
    description: string;
    image_url: string;
    added_at: string;
    updated_at: string;
    location: string;
    rental_count: string;
}

export interface EquipmentType {
    id: string;
    type: string;
    created_at: string;
}

export interface Reviews {
    id: string;
    user_id: string;
    equipment_id: string;
    average_rating: string;
    rating_count: string,
    comment: string;
    created_at: string;
}

export interface Rentals {
    id: string;
    renter_id: string;
    owner_id: string;
    eqipment_id: string;
    status: string;
    start_date: string,
    end_date: string;
    created_at: string;
    updated_at: string;
}
