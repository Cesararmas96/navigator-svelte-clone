<script lang="ts">
    import {A, Card, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import jsonData from "../../../../../data/widgetCarouselData.json";


    const getWidgetCardData = (jsonData: any) => {
        const data = jsonData;
        console.log(data);
        return data;

    };


    import ImageGallery from "@react2svelte/image-gallery";
    import {browser} from "$app/environment";

    const data = getWidgetCardData(jsonData);

</script>
{#if browser}
    <div class="">
        <Card>
            <ImageGallery items={data} showFullscreenButton={false} showPlayButton={false}
                          showBullets={false}/>
        </Card>
    </div>
{/if}
