<template>
    <div class="px-8 py-2 max-w-sm mx-auto border rounded-lg" v-if="!isScrolledBeyondSecondPart" :class="{hidden: isScrolledBeyondSecondPart}">
        <!-- Image will only show if the user hasn't scrolled beyond the defined point -->
        <NuxtImg v-if="!isScrolledBeyondFirstPart" src="preview_img.jpg" alt="A preview image"
            class="w-[400px] h-auto max-w-full max-h-64 rounded-lg shadow-lg" :class="{ hidden: isScrolledBeyondFirstPart }" quality="80" />
       
        <p class="font-bold text-4xl my-4">$64.99</p>
        <div class="flex justify-center">
            <button class="bg-[#8710D8] px-4 py-4 text-white font-bold w-full my-2 max-w-96">Add To Cart</button>
        </div>
        <div class="flex justify-center">
            <button class="bg-gray-200 px-4 py-4 font-bold w-full my-2 max-w-96">Buy Now</button>
        </div>
        <p class="text-sm text-center mt-4">30-Day Money-Back Guarantee</p>
        <p class="mt-4 font-bold">This course includes:</p>

        <div v-for="(feature, index) in features" :key="index" class="flex items-center space-x-2 my-2">
            <Icon :icon="feature.iconName" class="text-gray-500" width="20" height="20" />
            <span>{{ feature.text }}</span>
        </div>
       
        <div class="flex text-sm font-bold justify-between p-2">
            <p class="underline">Share</p>
            <p>Gift this course</p>
            <p>Apply Coupon</p>
        </div>

        <div class="border border-dashed p-1 m-2 flex justify-between text-gray-500">
            <div>
                <p><span class="font-bold">LETSLEARNNOW</span> is applied</p>
                <p>Udemy coupon</p>
            </div>
            <div class="flex items-center">
                <Icon icon="emojione-monotone:cross-mark" class="text-gray-500 hover:cursor-pointer" width="20"
                    height="20" />
            </div>
        </div>

        <div class="border border-solid border-black m-2 flex justify-between text-gray-500">
            <input placeholder="Enter Coupon" class="p-2">
            <button class="flex items-center bg-black text-white p-2 px-4 font-bold">
                Apply
            </button>
        </div>

        <div class="border-t border-black w-full my-8"></div>
        <div>
            <p class="font-bold text-xl">Training 5 or more people?</p>
            <p class="text-sm">Get your team access to 27,000+ top Udemy courses anytime, anywhere.</p>
            <button class="border border-black text-center font-bold w-full px-4 py-2">
                Try Udemy Business
            </button>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

const props = defineProps({
    isScrolledBeyondFirstPart: Boolean,
    isScrolledBeyondSecondPart: Boolean
  });

const features = [
    { iconName: 'material-symbols:live-tv-outline', text: '15 hours on-demand video' },
    { iconName: 'ic:round-code', text: '6 coding exercises' },
    { iconName: 'ic:round-help-outline', text: '2 practice tests' },
    { iconName: 'ic:baseline-insert-drive-file', text: '8 articles' },
    { iconName: 'mdi:folder-download-outline', text: '17 downloadable resources' },
    { iconName: 'material-symbols:smartphone', text: 'Access on mobile and TV' },
    { iconName: 'mdi:infinity', text: 'Full lifetime access' },
    { iconName: 'material-symbols:trophy-outline', text: 'Certificate of completion' },
];
</script>

<style scoped>
/* Additional styling if needed */
</style>