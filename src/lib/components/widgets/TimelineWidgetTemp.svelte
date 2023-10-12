<script lang="ts">
    import {Button, Card, Timeline, TimelineItem} from "flowbite-svelte";
    import jsonData from "../../../data/widgetTimelineData.json";
    import Icon from "$lib/components/common/Icon.svelte";


    const getWidgetCardData = (jsonData: any) => {
        const data = jsonData;
        console.log(data);
        return data;

    };

    const data = getWidgetCardData(jsonData);


</script>

<Card>
    <Timeline order='vertical'>
        {#each data as el}
            <TimelineItem title={el.title} date="{el.date}">
                <svelte:fragment slot="icon">
                      <span class="flex absolute -left-3 justify-center items-center w-6 h-6 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
                    <Icon icon={el.icon}/>
                      </span>
                </svelte:fragment>
                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{el.description}</p>
            </TimelineItem>
        {/each}
    </Timeline>

</Card>
