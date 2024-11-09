<template>
    <div class="bg-black text-white p-10">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <TopSkillsCategory title="About" :skills="['About us',
                'Careers',
                'Contact us',
                'Blog',
                'Investors']" />
            <TopSkillsCategory title="Discovery Udemy" :skills="['Get the app',
                'Teach on Udemy',
                'Plans and Pricing',
                'Affiliate',
                'Help and Support']" />
            <TopSkillsCategory title="Udemy for Business" :skills="['Udemy Business']" />
            <TopSkillsCategory title="Legal & Accessibility" :skills="['Accessibility statement',
                'Privacy policy',
                'Sitemap',
                'Terms']" />

        </div>
    </div>
</template>