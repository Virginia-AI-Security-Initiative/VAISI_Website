'use client';

import React, { useState } from 'react';
import TeamMemberCard from '@/components/TeamMemberCard';
import type { Member, MemberGroup } from '@/app/about/members';

type Tab = 'current' | 'former';

const tabIcons: Record<Tab, React.ReactNode> = {
    current: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
    ),
    former: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
};

const tabs: { id: Tab; label: string }[] = [
    { id: 'current', label: 'Current Team' },
    { id: 'former', label: 'Former Executives' },
];

function MemberGrid({ members }: { members: Member[] }) {
    const count = members.length;
    const gridClass =
        count === 1
            ? 'grid grid-cols-1 max-w-sm mx-auto'
            : count === 2
            ? 'grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={`${gridClass} gap-8`}>
            {members.map((member) => (
                <TeamMemberCard
                    key={member.id}
                    name={member.name}
                    title={member.title}
                    imageSrc={member.imageSrc}
                    linkedinUrl={member.linkedinUrl}
                    chatUrl={member.chatUrl}
                    graduatingYear={member.graduatingYear}
                />
            ))}
        </div>
    );
}

function CollapsibleGroup({ group }: { group: MemberGroup }) {
    const [open, setOpen] = useState(true);
    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-xl font-semibold text-primary mb-6 hover:opacity-75 transition-opacity"
            >
                {group.label}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-5 transition-transform duration-300 ${open ? 'rotate-0' : 'rotate-180'}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </button>
            <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <MemberGrid members={group.members} />
                </div>
            </div>
        </div>
    );
}

function GroupedMembers({ groups }: { groups: MemberGroup[] }) {
    const populated = groups.filter((g) => g.members.length > 0);
    if (populated.length === 0) {
        return <p className="text-center text-gray-500">No members to display.</p>;
    }
    return (
        <div className="flex flex-col gap-10">
            {populated.map((group) => (
                <CollapsibleGroup key={group.label} group={group} />
            ))}
        </div>
    );
}

export default function TeamSection({
    currentMembers,
    facultyAdvisors,
    formerMembers,
}: {
    currentMembers: MemberGroup[];
    facultyAdvisors: Member[];
    formerMembers: MemberGroup[];
}) {
    const [activeTab, setActiveTab] = useState<Tab>('current');

    return (
        <div>
            <div className="shadow-md rounded-xl mb-10">
                <div className="bg-white rounded-t-xl px-8 py-5">
                    <h2 className="text-3xl font-bold text-primary text-center">Meet Our Team</h2>
                </div>
                <div className="bg-slate-50 rounded-b-xl border-t border-gray-100 px-6 py-3 flex justify-center gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 border ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-primary border-primary hover:bg-primary/10'
                            }`}
                        >
                            {tabIcons[tab.id]}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-16">
                {activeTab === 'current' ? (
                    <GroupedMembers groups={currentMembers} />
                ) : (
                    <GroupedMembers groups={formerMembers} />
                )}
            </div>

            {facultyAdvisors.length > 0 && (
                <div className="mb-16">
                    <div className="bg-white rounded-xl shadow-md px-8 py-5 mb-8">
                        <h2 className="text-3xl font-bold text-primary text-center">Faculty Advisors</h2>
                    </div>
                    <MemberGrid members={facultyAdvisors} />
                </div>
            )}
        </div>
    );
}
