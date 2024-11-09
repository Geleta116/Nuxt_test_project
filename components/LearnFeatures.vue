
<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    }
}
</script>

<template>
    <div class="p-2 flex items-start max-w-96 text-wrap">
        <Icon name="material-symbols-light:check-rounded" class="mr-3 mt-1"/>
        <p class="w-full items-start text-sm">{{ text }}</p>
    </div>
</template>
