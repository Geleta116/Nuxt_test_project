<template>
    <div class="relative">

        <!-- Navbar -->
        <div class="fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300"
            :class="{ 'translate-y-negative-100': isNavBarScrolled }">
            <NavBar />
        </div>

        <!-- StickyInfo -->
        <div class="transition-all duration-300 ease-in-out"
            :class="{ 'fixed top-0 left-0 w-full z-40': isStickyVisible, 'hidden': !isStickyVisible }">
            <StickyInfo />
        </div>

        <div class="flex relative">
            <!-- Main Content Section -->
            <div class="flex-1 relative">
                <div class="bg-zinc-900 text-white p-20 pl-80 flex flex-col gap-4 w-screen">
                    <div class="text-purple-300">Development <span class="text-white">></span> Web Development <span
                            class="text-white">></span> Nuxt.js</div>
                    <div class="font-bold text-3xl max-w-[800px] ">NUXT 3 Bootcamp: Full-Stack Guide with Real-World
                        Projects</div>
                    <div class="text-xl max-w-[800px]">Become a NuxtJS Expert with just ONE COURSE, and build Powerful
                        Full-Stack
                        Web
                        Applications. {From zero to PRO in Nuxt}</div>
                    <div> <span class="font-bold text-orange-400 align-middle">4.6</span>
                        <Icon name="ic:outline-star" class="ml-1 text-lg text-orange-500 align-middle" />
                        <Icon name="ic:outline-star" class="ml-1 text-lg text-orange-500 align-middle" />
                        <Icon name="ic:outline-star" class="ml-1 text-lg text-orange-500 align-middle" />
                        <Icon name="ic:outline-star" class="ml-1 text-lg text-orange-500 align-middle" />
                        <Icon name="material-symbols-light:star-half-outline"
                            class="ml-1 text-lg text-orange-500 align-middle" />
                        <span class="text-sm font-thin ml-1"> <a href="#" class="text-purple-300 mr-2">(73 ratings)</a>
                            572 Students
                        </span>
                    </div>
                    <div>Created by <span class="text-purple">Noor Fakhry<span class="text-white">,</span> Programming
                            Fluency</span></div>
                    <div class="flex items-center space-x-2 ">
                        <Icon name="bi:patch-exclamation-fll" class="ml-1 text-lg" />
                        <p>Last updated 11/2024</p>
                        <Icon name="tabler:world align-middle" class="ml-1 text-lg " />
                        <p>English</p>
                        <Icon name="ic:baseline-subtitles" class="ml-1 text-lg" />
                        <p>English [Auto]</p>
                    </div>
                </div>
                <div class="border p-6 max-w-3xl ml-80 my-10">
                    <p class="font-bold text-2xl mb-4">What you'll Learn</p>
                    <div class="space-y-4">
                        <div v-for="(pair, index) in displayedPairs" :key="index"
                            class="flex flex-col md:flex-row justify-between">
                            <LearnFeatures :text="pair[0]" />
                            <LearnFeatures v-if="pair[1]" :text="pair[1]" />
                        </div>
                    </div>
                    <button @click="toggleShowMore"
                        class="px-4 text-purple-800 font-bold text-sm flex items-center justify-start w-full">
                        {{ showMore ? 'Show Less' : 'Show More' }}
                        <span v-if="showMore" class="flex items-center justify-center bg-white shadow-xl">
                            <Icon name="material-symbols:keyboard-arrow-up" class="ml-1" />
                        </span>
                        <span v-else class="flex items-center justify-center">
                            <Icon name="material-symbols:keyboard-arrow-down" class="ml-1" />
                        </span>
                    </button>
                </div>

                <!-- Explore Related Topics Section -->
                <div class="ml-80 mb-8">
                    <p class="font-bold text-2xl mb-4">Explore related topics</p>
                    <div class="flex">
                        <Topics title="Nuxt.js" />
                        <Topics title="Web development" />
                        <Topics title="Development" />
                    </div>
                </div>

                <!-- More Content Section -->
                <div class="ml-8 md:ml-80 p-10 bg-[#F7F9FA] max-w-3xl mb-10 flex gap-4 items-center">
                    <div>
                        <p class="text-2xl font-bold mb-4">Coding Exercises</p>
                        <p class="max-w-xs text-sm mb-10">This course includes our updated coding exercises so you can
                            practice your skills as you learn.</p>
                        <a href="#" class="text-purple-800 text-sm font-bold underline">See a demo</a>
                    </div>
                    <!-- Conditionally hide image when scrolled -->
                    <div v-if="!isScrolledBeyondFirstPart" class="flex-shrink-0">
                        <NuxtImg src="screen_img.jpg" alt="A screen image"
                            class="w-auto h-auto max-w-full max-h-64 rounded-lg shadow-lg" quality="80" />
                    </div>
                </div>
            </div>

            <div :class="[
                'absolute right-80 max-w-xs z-10 ml-8 md:ml-16 flex-shrink-0',
                { 'fixed right-80 w-full z-50': isScrolledBeyondFirstPart,  'absolute right-80 max-w-xs z-10 ml-8 md:ml-16 flex-shrink-0': isScrolledToBottom }
            ]">
                <div v-if="!isScrolledBeyondFirstPart">
                    <AddToCart :isScrolledBeyondFirstPart="isScrolledBeyondFirstPart" :isScrolledBeyondSecondPart="isScrolledBeyondSecondPart"
                        class="bg-white top-24 absolute right-20" />
                </div>
                <div v-else class="z-50 top-10 bg-white">
                    <AddToCart :isScrolledBeyondFirstPart="isScrolledBeyondFirstPart" :isScrolledBeyondSecondPart="isScrolledBeyondSecondPart"
                        class="z-50 bg-white top-[70px] absolute right-20" />
                </div>
            </div>
        </div>


        <CompaniesFooter />
        <TopSkillsMenu />   
        <BottomNavBar />
        <Footer />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const showMore = ref(true);
const isNavBarScrolled = ref(false);
const isStickyVisible = ref(false);
const isScrolledBeyondFirstPart = ref(false);
const isScrolledBeyondSecondPart = ref(false);


const features = [
    "Learn NuxtJS from Scratch: ",
    "Start with the basics and gradually progress to advanced topics, ensuring a solid understanding of NuxtJS fundamentals.",
    "An Introduction to this masterclass: ",
    "We'll guide you through success tips, course outline, tools needed, coding exercises, file downloads, and online classroom access",
    "Introduction to Nuxt JS: ",
    "Dive into NuxtJS concepts like rendering (server-side, client-side, universal), pros/cons, universal rendering, and Nuxt vs Vue comparison.",
    "Nuxt JS Basics: ",
    "Dive into Nuxt JS basics like setup, components, navigation, styling, middleware, lazy loading, assets, SEO, metadata, transitions & beyond!",
    "Data Fetching: ",
    "Mastering Data Fetching! Learn useFetch, useAsyncData & $fetch for dynamic apps.",
    "State Management: ",
    "Learn best practices for handling state management in Nuxt JS. {useState, Internal State, Shared State, and shallowRef State}",
    "Error Handling: ",
    "Master the art of Error Handling in Nuxt JS with optimal strategies for seamless development.",
    "Server-Side (Backend) in Nuxt JS: ",
    "Become a Nuxt JS backend master with Nuxt 3's Nitro server-side. {Server routes, middleware, data fetching, and more }",
    "Testing in Nuxt JS: ",
    "You will learn why testing is very important and discover optimal test writing techniques for your Nuxt apps using Nuxt and Vue test utilities.",
    "Authentication in Nuxt 3 using Supabase: ",
    "You will learn user authentication in Nuxt 3, grasp its significance, and effortlessly implement it with Supabase.",
    "Authentication using Google and Github in Nuxt 3 using Supabase: ",
    "Additionally, you'll gain expertise in implementing login with Google and GitHub, enhancing your application's accessibility and user experience.",
    "Deployment: ",
    "Master deployment by deploying your Nuxt 3 application to a platform like Vercel, ensuring your app is live and accessible to users.",
    "Real-World Example Projects: ",
    "By the end of the course, you’ll have built fully functioning apps, capable of handling backend API calls, authentication, and user interfaces with a modern stack.",
    "Comprehensive Curriculum: ",
    "By the end of this course, you will have a portfolio-worthy app to show off to employers, demonstrating your full-stack experience."
];

const pairs = computed(() => {
    return features.reduce((result, _, index, arr) => {
        if (index % 2 === 0) result.push(arr.slice(index, index + 2));
        return result;
    }, []);
});

const displayedPairs = computed(() => {
    return showMore.value ? pairs.value : pairs.value.slice(0, 3);
});

const toggleShowMore = () => {
    showMore.value = !showMore.value;
};


const handleScroll = () => {
    if (window.scrollY > 100) {
        isNavBarScrolled.value = true;
        isStickyVisible.value = true;
    } else {
        isNavBarScrolled.value = false;
        isStickyVisible.value = false;
    }


    if (window.scrollY > 200) {
        isScrolledBeyondFirstPart.value = true;
    } else if (window.scrollY > 210) {
        isScrolledBeyondFirstPart.value = false;
    } else {
        isScrolledBeyondFirstPart.value = false;
    }

    if (window.scrollY >= 1200) {
        isScrolledBeyondSecondPart.value = true;
    } else {
        isScrolledBeyondSecondPart.value = false;
    }


};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.transition-all {
    transition: all 0.3s ease-in-out;
}

.translate-y-negative-100 {
    transform: translateY(-100%);
}

.fixed {
    position: fixed;
}

.sticky {
    position: sticky;
}

.shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.opacity-0 {
    opacity: 0;
}

.z-50 {
    z-index: 50;
}

.z-10 {
    z-index: 10;
}
</style>
