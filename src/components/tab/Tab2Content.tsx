import {useRouter} from 'next/navigation';
import React from 'react';

export default function Tab2Asset() {
    let router = useRouter();

    return (
        <div className="p-4">
            <div className="mb-3 text-2xl font-bold">TRC-404 Asset</div>

            <div className="mt-20  mb-20">
                Your TRC-404 balance will be displayed here, along with the corresponding 404 NFTs.
            </div>
        </div>
    );
};


