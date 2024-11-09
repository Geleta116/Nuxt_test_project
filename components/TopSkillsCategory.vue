
<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        skills: {
            type: Array,
            required: true
        }
    }
}
</script>

<template>
    <div>
        <h2 class="font-bold text-lg mb-4">{{ title }}</h2>
        <ul>
            <li class="font-thin p-1"  v-for="(skill, index) in skills" :key="index"><a href="#">{{ skill }}</a></li>
        </ul>
    </div>
</template>