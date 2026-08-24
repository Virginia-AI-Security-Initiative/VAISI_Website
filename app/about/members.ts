export type Member = {
    id: number;
    name: string;
    title: string;
    imageSrc: string;
    personalWebsiteUrl?: string;
    linkedinUrl?: string;
    chatUrl?: string;
    graduatingYear?: string;
};

export type MemberGroup = {
    label: string;
    members: Member[];
};

export const teamMembers: MemberGroup[] = [
    { label: "Board", members: [
        {
            id: 1,
            name: "Seth Lifland",
            title: "President",
            imageSrc: "/team/seth.jpeg",
            personalWebsiteUrl: "https://sethlifland.com/",
            linkedinUrl: "https://www.linkedin.com/in/seth-lifland-8a604b326/",
            chatUrl: "https://cal.com/seth-lifland"
        },
        {
            id: 2,
            name: "Nia Mucher",
            title: "Vice President",
            imageSrc: "/team/nia_mucher.jpg",
            linkedinUrl: "https://www.linkedin.com/in/nia-m-a50406379/",
            chatUrl: "https://outlook.office.com/bookwithme/user/ce671a40730e45f89d8baac38714e128@virginia.edu?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature"
        },
        {
            id: 3,
            name: "Matthew Janicki",
            title: "Operations Lead",
            imageSrc: "/team/matthew.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/matthew-janicki-b69b12326/"
        },
        {
            id: 4,
            name: "Aran Jothi",
            title: "Operations Team",
            imageSrc: "/team/aran.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/aranjothi/"
        },
        {
            id: 5,
            name: "Marcus Southerland",
            title: "Operations Team",
            imageSrc: "/team/marcus.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/marcus-southerland/"
        },
        {
            id: 6,
            name: "Elias Krasny",
            title: "Forecasting Lead",
            imageSrc: "/team/elias.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/elias-krasny-82b433305/"
        },
        {
            id: 7,
            name: "Kasia- Esmeralda Wasiak",
            title: "Marketing Lead",
            imageSrc: "/team/kasia.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/kasia-esmeralda-wasiak-998268346/"
        },
        {
            id: 8,
            name: "Urav Tanna",
            title: "Social Lead",
            imageSrc: "/team/urav.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/urav-tanna-459689257/"
        },
    ]},
    { label: "Technical", members: [
        {
            id: 1,
            name: "Shubhrangshu Debsarkar",
            title: "Technical Team Lead",
            imageSrc: "/team/shubs1.JPG",
            personalWebsiteUrl: "https://shubhrangshu.com/",
            linkedinUrl: "https://www.linkedin.com/in/shubhrangshu-debsarkar-204683257/",
            chatUrl: "https://cal.com/shubs-debsarkar/15min?overlayCalendar=true"
        },
        {
            id: 2,
            name: "Aarav Lodha",
            title: "Technical Team",
            imageSrc: "/team/aarav_lodha (1).jpg",
            linkedinUrl: "https://www.linkedin.com/in/aaravtlodha/"
        },
        {
            id: 3,
            name: "Avery Li",
            title: "Technical Team",
            imageSrc: "/team/avery_li.jpeg",
            //linkedinUrl: "https://www.linkedin.com/in/aaravtlodha/"
        },
        {
            id: 4,
            name: "Ethan Cao",
            title: "Technical Team",
            imageSrc: "/team/ethan_cao.jpg",
            linkedinUrl: "https://www.linkedin.com/in/ethan-cao-82236a242/"
        },
        {
            id: 5,
            name: "Joshua Yoo",
            title: "Technical Team",
            imageSrc: "/team/Joshua_Yoo.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/joshua-yoo-3b9b7a267/"
        },
    ] },
    { label: "Policy", members: [
        {
            id: 1,
            name: "Taylor Petrofski",
            title: "Policy Team Lead",
            imageSrc: "/team/taylor_petrofski_headshot.png",
            linkedinUrl: "https://www.linkedin.com/in/taylor-petrofski-1a0523327/"
        },
        {
            id: 2,
            name: "Ricardo Bruinton",
            title: "Policy Team",
            imageSrc: "/team/ricardo.png",
            linkedinUrl: "https://www.linkedin.com/in/ricardobruinton/"
        },
        {
            id: 3,
            name: "Owen Watzlavick",
            title: "Policy Team",
            imageSrc: "/team/owen_watzlavick.png",
            linkedinUrl: "https://www.linkedin.com/in/owen-watzlavick/"
        },
        {
            id: 4,
            name: "Amith Polineni",
            title: "Policy Team",
            imageSrc: "/team/amith_polineni.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/amithpolineni/"
        },
        {
            id: 5,
            name: "Rishi Chandra",
            title: "Policy Team",
            imageSrc: "/team/rishi_chandra.jpeg",
            linkedinUrl: "https://www.linkedin.com/in/rishi-chandra12/"
        },
        {
            id: 6,
            name: "Hovsep Seferian",
            title: "Policy Team",
            imageSrc: "/team/hovsep.png",
            linkedinUrl: "https://www.linkedin.com/in/hovsep-seferian/"
        },
    ] },
];

export const facultyAdvisors: Member[] = [
    {
        id: 1,
        name: "Lee Lockwood",
        title: "Professor of Economics, UVA",
        imageSrc: "/faculty_advisors/lee_lockwood.jpg",
        linkedinUrl: "https://www.linkedin.com/in/lee-lockwood/"
    },
    {
        id: 2,
        name: "Chirag Agarwal",
        title: "Asst. Professor of Data Science, UVA",
        imageSrc: "/faculty_advisors/chirag_agarwal.png",
        linkedinUrl: "https://www.linkedin.com/in/chirag-agarwal-0a6a43a1/"
    },
];

export const formerMembers: MemberGroup[] = [
    { label: "Founders", members: [
    {
        id: 1,
        name: "Jason Chin",
        title: "Co-Founder, Former President",
        imageSrc: "/former_team/jason.jpg",
        linkedinUrl: "https://www.linkedin.com/in/jasonchin9/",
        graduatingYear: "Class of 2026"
    },
    {
        id: 2,
        name: "Andrew Broughton",
        title: "Co-Founder, Former Operations Co-Lead",
        imageSrc: "/former_team/andrew.png",
        linkedinUrl: "https://www.linkedin.com/in/andrewmbroughton/",
        graduatingYear: "Class of 2026"
    },

    ] },
    { label: "Class of 2026", members: [
    {
        id: 1,
        name: "Lily Egenrieder",
        title: "Former Operations Co-Lead",
        imageSrc: "/former_team/lily.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/lily-egenrieder/"
    },
    {
        id: 2,
        name: "Charlie Meyer",
        title: "Former Technical Team Co-Lead",
        imageSrc: "/former_team/charlie.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/charlie-meyer-loves-you/"
    },
    ] },
];
