const useDeleteItem = () => ({
	trigger: (id: string) => console.log('deleting item', id),
	isMutating: false,
})

export default useDeleteItem
