
<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>

<template>
    <div class="border rounded-full border-black hover:bg-gray-300 text-center align-center px-3 mr-4">
        <h2 class="font-bold  p-3 flex justify-center">{{ title }}</h2>
    </div>
</template>