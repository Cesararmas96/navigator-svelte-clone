<script lang="ts">
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte'
</script>

<div class="py-1">
	<Footer class=" bg-white dark:bg-dark-100 dark:text-gray-300 ">
		<FooterCopyright href="/" by="Navigator" year={2023} />
		<FooterLinkGroup
			ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
		>
			<FooterLink href="/">About</FooterLink>
			<FooterLink href="/">Privacy Policy</FooterLink>
			<FooterLink href="/">Licensing</FooterLink>
			<!-- <FooterLink href="/">Contact</FooterLink> -->
		</FooterLinkGroup>
	</Footer>
</div>
