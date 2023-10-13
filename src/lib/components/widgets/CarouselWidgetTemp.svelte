<script lang="ts">
    import {A, Card, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import jsonData from "../../../data/widgetListOfDocuments.json";


    const getWidgetCardData = (jsonData: any) => {
        const data = jsonData;
        console.log(data);
        return data;

    };


    const data = getWidgetCardData(jsonData);


    import ImageGallery from "@react2svelte/image-gallery";
    import {browser} from "$app/environment";

    const images = [
        {
            original: "https://picsum.photos/id/1018/1000/600/",
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
        }
    ];


</script>
{#if browser}
    <div class="">
        <Card>

            <ImageGallery items="{images}"/>

        </Card>
    </div>
{/if}
