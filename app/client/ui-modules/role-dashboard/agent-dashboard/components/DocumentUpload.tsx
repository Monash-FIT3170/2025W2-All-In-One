import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	uploadAgentDocument,
	selectIsUploading,
} from "../state/agent-documents-slice";
import { Button } from "../../../theming-shadcn/Button";
import { Input } from "../../../theming-shadcn/Input";
import { Label } from "../../../theming-shadcn/Label";
import { Calendar } from "../../../theming-shadcn/Calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../theming-shadcn/Popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../theming-shadcn/Select";
import {
	FileText,
	Upload,
	Calendar as CalendarIcon,
	AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../../utils";

interface DocumentUploadProps {
	onUploadSuccess?: () => void;
	propertyId?: string;
	propertyAddress?: string;
}

export function DocumentUpload({
	onUploadSuccess,
	propertyId,
	propertyAddress,
}: DocumentUploadProps) {
	const dispatch = useAppDispatch();
	const isUploading = useAppSelector(selectIsUploading);

	const [title, setTitle] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [validUntil, setValidUntil] = useState<Date | undefined>(undefined);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setErrors((prev) => ({ ...prev, file: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!file) {
			newErrors.file = "Please select a file";
		}

		if (!validUntil) {
			newErrors.validUntil = "Please select a valid until date";
		}

		if (!propertyId) {
			newErrors.property = "Property selection is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		if (!propertyId || !file || !validUntil) {
			return;
		}

		try {
			// Get the current user ID from the auth context
			const currentUserId = Meteor.userId();
			if (!currentUserId) {
				throw new Error("User not authenticated");
			}

			await dispatch(
				uploadAgentDocument({
					file,
					title,
					propertyId: propertyId,
					agentId: currentUserId,
					validUntil,
				})
			).unwrap();

			// Reset form
			setTitle("");
			setFile(null);
			setValidUntil(undefined);
			setErrors({});

			onUploadSuccess?.();
		} catch (error) {
			console.error("Upload failed:", error);
			setErrors({ submit: "Failed to upload document. Please try again." });
		}
	};

	const handleDateSelect = (date: Date | undefined) => {
		setValidUntil(date);
		setErrors((prev) => ({ ...prev, validUntil: "" }));
	};

	return (
		<div className="bg-white rounded-lg border p-6">
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Upload Lease Agreement
				</h3>
				<p className="text-sm text-gray-600">
					Upload a new lease agreement document for{" "}
					{propertyAddress
						? `property at ${propertyAddress}`
						: "the selected property"}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Title Input */}
				<div className="space-y-2">
					<Label htmlFor="title">Document Title *</Label>
					<Input
						id="title"
						type="text"
						placeholder="Enter document title (e.g., '2024-2025 Lease Agreement')"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							setErrors((prev) => ({ ...prev, title: "" }));
						}}
						className={cn(errors.title && "border-red-500")}
					/>
					{errors.title && (
						<div className="flex items-center gap-2 text-sm text-red-600">
							<AlertCircle className="w-4 h-4" />
							{errors.title}
						</div>
					)}
				</div>

				{/* File Upload */}
				<div className="space-y-2">
					<Label htmlFor="file">Document File *</Label>
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
						<input
							id="file"
							type="file"
							accept=".pdf,.doc,.docx,.txt"
							onChange={handleFileChange}
							className="hidden"
						/>
						<label htmlFor="file" className="cursor-pointer">
							<div className="flex flex-col items-center">
								<FileText className="w-12 h-12 text-gray-400 mb-2" />
								<p className="text-sm text-gray-600">
									{file ? file.name : "Click to select file or drag and drop"}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
								</p>
							</div>
						</label>
					</div>
					{file && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<FileText className="w-4 h-4" />
							<span>{file.name}</span>
							<span className="text-gray-400">
								({(file.size / 1024 / 1024).toFixed(2)} MB)
							</span>
						</div>
					)}
					{errors.file && (
						<div className="flex items-center gap-2 text-sm text-red-600">
							<AlertCircle className="w-4 h-4" />
							{errors.file}
						</div>
					)}
				</div>

				{/* Valid Until Date */}
				<div className="space-y-2">
					<Label>Valid Until Date *</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"w-full justify-start text-left font-normal",
									!validUntil && "text-muted-foreground",
									errors.validUntil && "border-red-500"
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{validUntil ? format(validUntil, "PPP") : "Pick a date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={validUntil}
								onSelect={handleDateSelect}
								initialFocus
								disabled={(date) => date < new Date()}
							/>
						</PopoverContent>
					</Popover>
					{errors.validUntil && (
						<div className="flex items-center gap-2 text-sm text-red-600">
							<AlertCircle className="w-4 h-4" />
							{errors.validUntil}
						</div>
					)}
				</div>

				{/* Submit Error */}
				{errors.submit && (
					<div className="flex items-center gap-2 text-sm text-red-600">
						<AlertCircle className="w-4 h-4" />
						{errors.submit}
					</div>
				)}

				{/* Submit Button */}
				<Button
					type="submit"
					disabled={
						isUploading || !title.trim() || !file || !validUntil || !propertyId
					}
					className="w-full"
				>
					{isUploading ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
							Uploading...
						</>
					) : (
						<>
							<Upload className="w-4 h-4 mr-2" />
							Upload Document
						</>
					)}
				</Button>
			</form>
		</div>
	);
}
