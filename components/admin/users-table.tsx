'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	MoreHorizontal,
	ShieldAlert,
	ShieldCheck,
	UserCog,
	Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { updateUserRole, suspendUser, unsuspendUser } from '@/api/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UsersTableProps {
	users: User[];
	pagination: PaginationType;
	isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
	const queryClient = useQueryClient();
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [actionType, setActionType] = useState<
		'suspend' | 'unsuspend' | 'role' | null
	>(null);
	const [newRole, setNewRole] = useState<'user' | 'creator' | 'admin'>('user');

	const { mutate: handleSuspend, isPending: isSuspending } = useMutation({
		mutationFn: (id: string) => suspendUser(id),
		onSuccess: () => {
			toast({ title: 'User suspended successfully' });
			queryClient.invalidateQueries({ queryKey: ['admin-users'] });
			setSelectedUser(null);
		},
		onError: () =>
			toast({ title: 'Failed to suspend user', variant: 'destructive' }),
	});

	const { mutate: handleUnsuspend, isPending: isUnsuspending } = useMutation({
		mutationFn: (id: string) => unsuspendUser(id),
		onSuccess: () => {
			toast({ title: 'User unsuspended successfully' });
			queryClient.invalidateQueries({ queryKey: ['admin-users'] });
			setSelectedUser(null);
		},
		onError: () =>
			toast({ title: 'Failed to unsuspend user', variant: 'destructive' }),
	});

	const { mutate: handleRoleUpdate, isPending: isUpdatingRole } = useMutation({
		mutationFn: ({
			id,
			role,
		}: {
			id: string;
			role: 'user' | 'creator' | 'admin';
		}) => updateUserRole(id, role),
		onSuccess: () => {
			toast({ title: 'Role updated successfully' });
			queryClient.invalidateQueries({ queryKey: ['admin-users'] });
			setSelectedUser(null);
		},
		onError: () =>
			toast({ title: 'Failed to update role', variant: 'destructive' }),
	});

	const isPending = isSuspending || isUnsuspending || isUpdatingRole;

	const confirmAction = () => {
		if (!selectedUser) return;

		if (actionType === 'suspend') {
			handleSuspend(selectedUser._id);
		} else if (actionType === 'unsuspend') {
			handleUnsuspend(selectedUser._id);
		} else if (actionType === 'role') {
			handleRoleUpdate({ id: selectedUser._id, role: newRole });
		}
	};

	if (isLoading) {
		return <div>Loading users...</div>;
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user._id}>
								<TableCell className="flex items-center gap-3">
									<Avatar className="h-9 w-9">
										<AvatarImage
											src={user.avatarUrl}
											alt={user.email}
										/>
										<AvatarFallback>
											{user.email[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="font-medium">
											{(user as any).displayName || 'User'}
										</span>
										<span className="text-xs text-muted-foreground">
											{user.email}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="capitalize">
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									{(user as any).isSuspended ? (
										<Badge variant="destructive">Suspended</Badge>
									) : (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
											Active
										</Badge>
									)}
								</TableCell>
								<TableCell>
									{format(new Date(user.createdAt), 'MMM d, yyyy')}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={() => {
													setSelectedUser(user);
													setActionType('role');
													setNewRole(user.role);
												}}>
												<UserCog className="mr-2 h-4 w-4" /> Change Role
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											{(user as any).isSuspended ? (
												<DropdownMenuItem
													onClick={() => {
														setSelectedUser(user);
														setActionType('unsuspend');
													}}
													className="text-green-600 focus:text-green-600">
													<ShieldCheck className="mr-2 h-4 w-4" /> Unsuspend
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem
													onClick={() => {
														setSelectedUser(user);
														setActionType('suspend');
													}}
													className="text-red-600 focus:text-red-600">
													<ShieldAlert className="mr-2 h-4 w-4" /> Suspend
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={!!selectedUser}
				onOpenChange={(open) => !open && !isPending && setSelectedUser(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{actionType === 'suspend' && 'Suspend User'}
							{actionType === 'unsuspend' && 'Unsuspend User'}
							{actionType === 'role' && 'Change User Role'}
						</DialogTitle>
						<DialogDescription>
							{actionType === 'suspend' &&
								`Are you sure you want to suspend ${selectedUser?.email}? They will be logged out immediately.`}
							{actionType === 'unsuspend' &&
								`Are you sure you want to unsuspend ${selectedUser?.email}?`}
							{actionType === 'role' &&
								`Change role for ${selectedUser?.email}.`}
						</DialogDescription>
					</DialogHeader>

					{actionType === 'role' && (
						<div className="py-4">
							<Select
								value={newRole}
								onValueChange={(val: any) => setNewRole(val)}>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="creator">Creator</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setSelectedUser(null)}
							disabled={isPending}>
							Cancel
						</Button>
						<Button
							variant={actionType === 'suspend' ? 'destructive' : 'default'}
							onClick={confirmAction}
							disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
