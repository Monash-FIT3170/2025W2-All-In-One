import React, { useState } from "react";
import { useAppSelector } from "../../../../store";
import {
	selectDocuments,
	selectDocumentsLoading,
	selectDocumentsError,
} from "../state/tenant-documents-slice";
import { Button } from "../../../theming-shadcn/Button";
import { Badge } from "../../../theming-shadcn/Badge";
import { FileText, Calendar, AlertCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../../theming-shadcn/Dialog";

interface DocumentListProps {
	onRefresh?: () => void;
}

export function DocumentList({ onRefresh }: DocumentListProps) {
	const documents = useAppSelector(selectDocuments);
	const isLoading = useAppSelector(selectDocumentsLoading);
	const error = useAppSelector(selectDocumentsError);

	const [selectedDocument, setSelectedDocument] = useState<any>(null);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

	const getDocumentStatus = (validUntil: Date) => {
		const now = new Date();
		const expiryDate = new Date(validUntil);

		if (expiryDate < now) {
			return { status: "Expired", variant: "destructive" as const };
		} else if (
			expiryDate.getTime() - now.getTime() <
			30 * 24 * 60 * 60 * 1000
		) {
			// 30 days
			return { status: "Expiring Soon", variant: "secondary" as const };
		} else {
			return { status: "Active", variant: "default" as const };
		}
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-lg border p-6">
				<div className="flex items-center justify-center py-8">
					<div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
					<span className="ml-2 text-gray-600">Loading documents...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white rounded-lg border p-6">
				<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
					<AlertCircle className="w-4 h-4 text-red-600" />
					<span className="text-sm text-red-700">{error}</span>
				</div>
			</div>
		);
	}

	if (documents.length === 0) {
		return (
			<div className="bg-white rounded-lg border p-6">
				<div className="text-center py-8">
					<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No documents found
					</h3>
					<p className="text-gray-500">
						Upload your first lease agreement document to get started.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="bg-white rounded-lg border">
				<div className="px-6 py-4 border-b">
					<h3 className="text-lg font-semibold">Your Documents</h3>
					<p className="text-sm text-gray-600">
						Manage your lease agreement documents
					</p>
				</div>

				<div className="divide-y">
					{documents.map((document) => {
						const status = getDocumentStatus(document.validUntil);
						return (
							<div key={document._id} className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4 flex-1">
										<FileText className="w-5 h-5 text-red-500" />

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<h4 className="text-sm font-medium text-gray-900 truncate">
													{document.title || "Unknown Document"}
												</h4>
												<Badge variant={status.variant}>{status.status}</Badge>
											</div>

											<div className="flex items-center gap-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<Calendar className="w-4 h-4" />
													<span>
														Uploaded:{" "}
														{format(
															new Date(document.uploadedDate),
															"MMM dd, yyyy"
														)}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Calendar className="w-4 h-4" />
													<span>
														Valid until:{" "}
														{format(
															new Date(document.validUntil),
															"MMM dd, yyyy"
														)}
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2 ml-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												window.open(document.documentUrl, "_blank")
											}
										>
											<ExternalLink className="w-4 h-4 mr-1" />
											Open
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
