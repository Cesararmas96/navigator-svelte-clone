<script lang="ts">
    import {Button, Card} from "flowbite-svelte";
    import jsonData from "../../../data/widgetCardData.json";


    const getWidgetCardData = (jsonData: any) => {
        const data = jsonData;
        console.log(data);
        return data;

    };

    const data = getWidgetCardData(jsonData);


</script>


<Card img={data.src ? data.src : ''}>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data.title}</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{data.description}</p>
    <Button class="mt-2" href={data.btn.external ? data.btn.to : '#'}
            color={data.btn.backgroundColor || 'red'}>{data.btn.btnText}</Button>
</Card>
