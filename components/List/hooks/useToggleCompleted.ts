const useRenameItem = () => ({
	trigger: (id: string) => console.log('toggling completed', id),
	isMutating: false,
})

export default useRenameItem
