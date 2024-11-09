<template>
    <div class="flex text-center items-center m-2 gap-6">
        <NuxtImg src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg" alt="A local image" width="100"
            height="400" quality="80" />
        <div class="text-gray-700 text-sm">
            Categories
        </div>
        <div class="flex items-center border rounded-3xl w-7/12 border-black">
            <Icon name="material-symbols:search-rounded" class="ml-2 text-2xl text-gray-500" />
            <input placeholder="Search for anything" class="p-1 m-2 outline-none" />
        </div>
        <div class="text-gray-800 text-sm">
            Udemy Business
        </div>
        <div class="text-gray-800 text-sm">
            Tech on Udemy
        </div>
        <div class="py2">
            <Icon name="material-symbols:shopping-cart-outline-sharp" class="text-2xl"/>
        </div>
        <div class="flex justify-between gap-4">
            <button class="border border-black hover:bg-gray-300 px-4 py-2 font-bold">
                Login
            </button>
            <button  class="border text-white bg-gray-800 hover:bg-gray-700 border-black  px-4 py-2 font-bold">
                Sign up
            </button>
            <button class="border border-black hover:bg-gray-300 text-2xl px-2 font-bold">
                <Icon name="tabler:world" />
            </button>
        </div>

    </div>
</template>