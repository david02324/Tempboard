<script>
    import {onMount} from "svelte";
    import {replace} from "svelte-spa-router";

    onMount(async () => {
        const res = await fetch(
            '/api/board/list',
            { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hashed')}`
                }
            }
        )
        if (!res.ok) {
            replace('/')
            return
        }
    })
</script>

<div class="flex items-center justify-center w-full h-full">
    <div class="flex flex-col gap-y-1 items-center">
        <h1 class="text-2xl">Upload by paste!</h1>
    </div>
</div>