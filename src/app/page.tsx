'use client';

import {useState} from "react";
import Tab1Content from "@/components/tab/Tab1Content";
import Tab2Content from "@/components/tab/Tab2Content";
import Tab3Content from "@/components/tab/Tab3Content";
import Tab4Content from "@/components/tab/Tab4Content";
import MobileTab from "@/components/mobile-tab";

export default function Page() {
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    return (
        <div>
            {/* Your main content goes here */}
            <div className="">
                {/* Render different content based on the activeTab state */}
                {activeTab === 'tab1' && <Tab1Content/>}
                {activeTab === 'tab2' && <Tab2Content/>}
                {activeTab === 'tab3' && <Tab3Content/>}
                {activeTab === 'tab4' && <Tab4Content/>}
            </div>

            {/* Render the MobileTab component */}
            <MobileTab onTabChange={handleTabChange}/>
        </div>
    )

}
