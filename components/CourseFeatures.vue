<script>
export default {
    props: {
        iconName: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }
}
</script>



<template>
    <div class="flex gap-4">
        <Icon :name="`${iconName} text-2xl align-middle `" class="text-black" />
        <p class="text-sm"> {{ text }}</p>
    </div>

</template> 