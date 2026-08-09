'use client';

import React, { useState } from 'react';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion';
import { sectionTitleClass } from '@/components/sectionTitle';
import type { Member, MemberGroup } from '@/app/about/members';

type Tab = 'current' | 'former';

const tabs: { id: Tab; label: string }[] = [
    { id: 'current', label: 'Current Team' },
    { id: 'former', label: 'Former Executives' },
];

function MemberGrid({ members }: { members: Member[] }) {
    const count = members.length;
    const gridClass =
        count === 1
            ? 'grid grid-cols-1 max-w-sm'
            : count === 2
            ? 'grid grid-cols-1 md:grid-cols-2 max-w-2xl'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <StaggerGroup className={`${gridClass} gap-5`} stagger={0.06}>
            {members.map((member) => (
                <StaggerItem key={member.id}>
                    <TeamMemberCard
                        name={member.name}
                        title={member.title}
                        imageSrc={member.imageSrc}
                        linkedinUrl={member.linkedinUrl}
                        chatUrl={member.chatUrl}
                        graduatingYear={member.graduatingYear}
                    />
                </StaggerItem>
            ))}
        </StaggerGroup>
    );
}

function CollapsibleGroup({ group }: { group: MemberGroup }) {
    const [open, setOpen] = useState(true);
    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                className="tap-scale flex min-h-11 items-center gap-2 text-xl font-semibold text-gray-900 mb-6 hover:opacity-75"
                aria-expanded={open}
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
        <div className="flex flex-col gap-8">
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
            <div className="mb-10">
                <Reveal>
                    <h2 className={`${sectionTitleClass} text-gray-900 mb-6`}>Meet Our Team</h2>
                </Reveal>
                <div className="flex items-center gap-4">
                    {tabs.map((tab, idx) => (
                        <React.Fragment key={tab.id}>
                            {idx > 0 && <span className="text-gray-300">|</span>}
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`tap-scale min-h-11 text-base font-semibold transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-primary underline underline-offset-4 decoration-secondary decoration-2'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                                aria-pressed={activeTab === tab.id}
                            >
                                {tab.label}
                            </button>
                        </React.Fragment>
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
                    <Reveal>
                        <h2 className={`${sectionTitleClass} text-gray-900 mb-8`}>Faculty Advisors</h2>
                    </Reveal>
                    <MemberGrid members={facultyAdvisors} />
                </div>
            )}
        </div>
    );
}
