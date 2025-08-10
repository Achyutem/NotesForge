"use client";

import React from "react";
import {
    Search,
    ChevronsLeft,
    ChevronsRight,
    MoreVertical,
    Pencil,
    Trash,
    FolderOpen,
    XCircle,
    LogOut,
    Settings,
    Upload,
    FileDown,
    X,
    FilePlus2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; // Import Link for routing
import { useShortcuts } from "../hooks/useShortcuts";
import { TodoSidebarProps } from "../utils/types";
import { logout } from "../utils/logout";
import { useImportHandler } from "../hooks/useImportHandler";
import { useExportHandler } from "../hooks/useExportHandler";
import { Theme } from "../(components)/themeColor";

interface ExtendedTodoSidebarProps extends TodoSidebarProps {
    isMobile?: boolean;
    onClose?: () => void;
    // New props for tag filtering
    filterTag: string | null;
    onTagSelect: (tag: string) => void;
    onClearTagFilter: () => void;
}

const formatRelativeTime = (createdAt: string, updatedAt: string) => {
    const dateToUse = updatedAt > createdAt ? updatedAt : createdAt;
    const mostRecentDate = new Date(
        dateToUse.endsWith("Z") ? dateToUse : dateToUse + "Z"
    );
    const now = new Date();
    const diffInSeconds = Math.floor(
        (now.getTime() - mostRecentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return mostRecentDate.toLocaleDateString();
};

const ActionsMenu = () => {
    const { triggerImport, renderFileInput } = useImportHandler();
    const { triggerExport } = useExportHandler();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 hover:text-primary/90"
                    >
                        <Settings className="w-4 h-4 text-primary" />
                        <span>Actions & Settings</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    side="top"
                    className="w-56 mb-1 p-2 border-border/20 bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl"
                >
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            triggerImport();
                        }}
                        className="rounded-md p-2 gap-2 font-medium cursor-pointer"
                    >
                        <FileDown className="w-4 h-4 text-primary" />
                        Import from CSV...
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={triggerExport}
                        className="rounded-md p-2 gap-2 font-medium cursor-pointer"
                    >
                        <Upload className="w-4 h-4 text-primary" />
                        Export All to CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="rounded-md p-2 gap-2 font-medium cursor-default focus:bg-transparent"
                    >
                        <div className="flex items-center justify-between w-full">
                            <span>Toggle Theme</span>
                            <Theme />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                        onClick={logout}
                        className="rounded-md p-2 gap-2 font-medium text-red-500 focus:text-red-400 focus:bg-destructive/10 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {renderFileInput()}
        </>
    );
};

const ActionsMenuCollapsed = () => {
    const { triggerImport, renderFileInput } = useImportHandler();
    const { triggerExport } = useExportHandler();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="w-5 h-5 text-primary" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    side="right"
                    className="w-56 ml-1 p-2 border-border/20 bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl"
                >
                    <DropdownMenuLabel className="px-2 py-1.5 font-semibold">
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            triggerImport();
                        }}
                        className="rounded-md p-2 gap-2 font-medium cursor-pointer"
                    >
                        <Upload className="w-4 h-4 text-primary" />
                        Import from CSV...
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={triggerExport}
                        className="rounded-md p-2 gap-2 font-medium cursor-pointer"
                    >
                        <FileDown className="w-4 h-4 text-primary" />
                        Export All to CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="rounded-md p-2 gap-2 font-medium cursor-default focus:bg-transparent"
                    >
                        <div className="flex items-center justify-between w-full">
                            <span>Theme</span>
                            <Theme />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                        onClick={logout}
                        className="rounded-md p-2 gap-2 font-medium text-red-500 focus:text-red-600 focus:bg-destructive/10 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {renderFileInput()}
        </>
    );
};

const TodoSidebar: React.FC<ExtendedTodoSidebarProps> = ({
    todos,
    searchQuery,
    selectedTodo,
    unsavedTitle,
    unsavedTags,
    hasUnsavedChanges,
    filterTag,
    onSearchChange,
    onTodoSelect,
    onDeleteTodo,
    onEditTodo,
    onTagSelect,
    onClearTagFilter,
    isMobile,
    onClose,
    onCreateTodo,
}) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    useShortcuts({
        toggleSidebar: () => !isMobile && setIsCollapsed((prev) => !prev),
    });

    const sidebarVariants = {
        expanded: {
            width: 320,
            transition: { type: "spring", stiffness: 400, damping: 40 },
        },
        collapsed: {
            width: 64,
            transition: { type: "spring", stiffness: 400, damping: 40 },
        },
    };

    const showCollapsed = !isMobile && isCollapsed;

    return (
        <motion.aside
            variants={!isMobile ? sidebarVariants : undefined}
            initial={showCollapsed ? "collapsed" : "expanded"}
            animate={showCollapsed ? "collapsed" : "expanded"}
            className="bg-muted/30 border-r border-border h-full flex flex-col"
        >
            <AnimatePresence>
                {!showCollapsed ? (
                    <motion.div key="expanded-header" className="shrink-0">
                        <div className="flex items-center justify-between p-4 border-b border-border h-[65px]">
                            {/* Logo and Name (clickable) */}
                            <Link href="/dashboard" className="flex items-center gap-1.5 overflow-hidden cursor-pointer">
                                <Image
                                    src="/favicon.ico"
                                    alt="NotesForge logo"
                                    width={24}
                                    height={24}
                                    priority
                                />
                                <h1 className="text-base font-bold text-primary">NotesForge</h1>
                            </Link>
                            {isMobile ? (
                                <Button size="icon" variant="ghost" onClick={onClose}>
                                    <X className="w-5 h-5 text-primary" />
                                </Button>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setIsCollapsed(true)}
                                            >
                                                <ChevronsLeft className="w-4 h-4 text-primary" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Collapse Sidebar (Ctrl+B)</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        <div className="p-3 border-b border-border flex items-center gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="search-input"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder="Search notes..."
                                    className="pl-9 pr-8 text-sm rounded-md bg-background border-border caret-primary"
                                />
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={onCreateTodo}
                                            variant="secondary"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 "
                                        >
                                            <FilePlus2 className="w-5 h-5 text-primary" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        New Note (Ctrl+Shift+N)
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {filterTag && (
                            <div className="p-3 flex items-center justify-between border-b border-border bg-primary/5">
                                <Badge variant="outline" className="font-medium">
                                    Tag: {filterTag}
                                </Badge>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={onClearTagFilter}
                                                className="h-7 w-7"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Clear filter</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="collapsed-header"
                        className="flex flex-col items-center shrink-0 border-b border-border py-2"
                    >
                        {/* Logo (clickable) */}
                        <Link href="/dashboard" className="cursor-pointer mb-2">
                            <Image
                                src="/favicon.ico"
                                alt="NotesForge logo"
                                width={32}
                                height={32}
                                priority
                            />
                        </Link>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => setIsCollapsed(false)}
                                    >
                                        <ChevronsRight className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Expand Sidebar (Ctrl+B)</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={onCreateTodo}
                                        variant="ghost"
                                        size="icon"
                                        className="mt-2"
                                    >
                                        <FilePlus2 className="w-5 h-5 text-primary" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    New Note (Ctrl+Shift+N)
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={`flex-1 overflow-y-auto ${
                    showCollapsed ? "px-1 py-1" : "p-2 space-y-1"
                }`}
            >
                {todos.length === 0 && !showCollapsed ? (
                    <div className="text-center p-10 text-muted-foreground">
                        <FolderOpen className="h-10 w-10 mx-auto mb-3" />
                        <p className="font-medium">No notes yet</p>
                        <p className="text-sm">Create a note or clear filters!</p>
                    </div>
                ) : showCollapsed ? (
                    todos.map((todo) => {
                        const isSelected = selectedTodo?.id === todo.id;
                        return (
                            <React.Fragment key={todo.id}>
                                <div className="relative py-1">
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-collapsed-note"
                                            className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full"
                                        />
                                    )}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={isSelected ? "secondary" : "ghost"}
                                                    className="w-full h-10 text-sm font-bold"
                                                    onClick={() => onTodoSelect(todo)}
                                                >
                                                    {(todo.title?.charAt(0) || "N").toUpperCase()}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>{todo.title || "Untitled"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </React.Fragment>
                        );
                    })
                ) : (
                    todos.map((todo) => {
                        const isSelected = selectedTodo?.id === todo.id;
                        return (
                            <motion.div
                                key={todo.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => onTodoSelect(todo)}
                                className={`relative p-3 cursor-pointer rounded-lg transition-colors ${
                                    isSelected
                                        ? "bg-primary/10"
                                        : "hover:bg-primary/10 hover:bg-opacity-50"
                                }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="selected-indicator"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                                    />
                                )}
                                <div className="flex justify-between items-start gap-2">
                                    <h3
                                        className={`min-w-0 text-sm font-semibold truncate ${
                                            isSelected ? "text-primary" : "text-foreground"
                                        }`}
                                    >
                                        {hasUnsavedChanges && isSelected
                                            ? unsavedTitle
                                            : todo.title || "Untitled"}
                                    </h3>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-primary rounded-full shrink-0"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40 p-1.5 border-border/20 bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl"
                                        >
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditTodo(todo);
                                                }}
                                                className="rounded-md p-2 gap-2 font-medium cursor-pointer"
                                            >
                                                <Pencil className="w-4 h-4 text-muted-foreground" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-border/50 my-1" />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="rounded-md p-2 gap-2 font-medium text-red-500 focus:text-red-400 focus:bg-destructive/10 cursor-pointer"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action will permanently delete this note.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteTodo(todo.id);
                                                            }}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex justify-between items-end mt-1">
                                    <div className="flex flex-wrap gap-1.5">
                                        {(hasUnsavedChanges && isSelected ? unsavedTags : todo.tags)
                                            ?.slice(0, 3)
                                            .map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onTagSelect(tag);
                                                    }}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {formatRelativeTime(todo.createdAt, todo.updatedAt)}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <div
                className={`shrink-0 border-t border-border ${
                    showCollapsed ? "p-1 flex justify-center" : "p-3"
                }`}
            >
                {showCollapsed ? <ActionsMenuCollapsed /> : <ActionsMenu />}
            </div>
        </motion.aside>
    );
};

export default TodoSidebar;
