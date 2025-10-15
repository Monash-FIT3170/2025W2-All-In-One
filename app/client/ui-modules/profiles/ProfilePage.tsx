import React from "react";
import { useAppDispatch, useAppSelector } from "../../store";

import {
    resetProfile,
    selectIsEditing,
    selectProfileData,
    setEditing,
    updateField,
    setProfileData,
    fetchProfileData,
    saveProfileData,
} from "./state/profile-slice";

import { EditableAvatar } from "./components/EditableAvatar";
import { Button } from "../theming-shadcn/Button";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ContactInfoCard } from "./components/ContactInfoCard";
import { EmploymentInfoCard } from "./components/EmploymentInfoCard";
import { current } from "@reduxjs/toolkit";
import { uploadFileHandler } from "../../library-modules/apis/azure/blob-api";
import { Role } from "/app/shared/user-role-identifier";
import { setCurrentProfileData } from "../user-authentication/state/reducers/current-user-slice";
import { CheckCircle, XCircle } from "lucide-react";
import { apiUpdateAccountEmail } from "../../library-modules/apis/user/user-account-api";

export function ProfilePage(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfileData);
    const isEditing = useAppSelector(selectIsEditing);

    const [tempProfileImage, setProfileImage] = React.useState<string | null>(
        null
    );

    const [localProfile, setLocalProfile] = React.useState(profile);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [notification, setNotification] = React.useState<{
        message: string;
        type: "error" | "success";
    } | null>(null);

    const currentUser = useAppSelector(
        (state) => state.currentUser.currentUser
    );
    const authUser = useAppSelector((state) => state.currentUser.authUser);

    const userRole = authUser?.role;
    const userSignUp = currentUser?.createdAt;

    const formateDateToMonthYear = (date: string | undefined): string => {
        if (!date) return "...";
        const dateObject = new Date(date);

        return dateObject.toLocaleDateString("en-AU", {
            year: "numeric",
            month: "long",
        });
    };

    React.useEffect(() => {
        if (currentUser?.profileDataId) {
            dispatch(fetchProfileData(currentUser.profileDataId));
        }
    }, [currentUser?.profileDataId]);

    // NEED TO MAKE A "Local profile" so that u can make multiple changes without saving until the btn is pressed
    React.useEffect(() => {
        if (isEditing) {
            setLocalProfile(profile); // clone the latest profile when edit mode begins
        }
    }, [isEditing]);

    React.useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 300000); // Auto-dismiss after 5 minutes

            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateProfile = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Simple phone regex: allows optional +, digits, spaces, hyphens, and parentheses.
        const phoneRegex = /^\+?[0-9\s-()]{7,20}$/;

        if (!localProfile.firstName)
            newErrors.firstName = "First name is required.";
        if (!localProfile.lastName)
            newErrors.lastName = "Last name is required.";
        if (!localProfile.dob) newErrors.dob = "Date of birth is required.";
        if (!localProfile.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(localProfile.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!localProfile.phone) {
            newErrors.phone = "Phone number is required.";
        } else if (!phoneRegex.test(localProfile.phone)) {
            newErrors.phone = "Please enter a valid phone number.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // in handle save, we can add validation for fields and cancel it if fields incorrect
    const handleSave = async () => {
        setNotification(null); // Clear previous notifications
        if (!validateProfile()) {
            setNotification({
                message: "Please fill in all mandatory fields correctly.",
                type: "error",
            });
            return;
        }

        if (currentUser?.profileDataId && authUser?.userId) {
            // If email changed, update Meteor account email
            if (localProfile.email !== profile.email) {
                try {
                    await apiUpdateAccountEmail(authUser.userId, localProfile.email);
                } catch (err) {
                    setNotification({
                        message: "Failed to update account email. " + (err instanceof Error ? err.message : ""),
                        type: "error",
                    });
                    return;
                }
            }

            const updated = await dispatch(
                saveProfileData({
                    id: currentUser.profileDataId,
                    profile: localProfile,
                })
            ).unwrap();
            dispatch(setCurrentProfileData(updated));
            dispatch(setEditing(false));
            setErrors({});
            setNotification({
                message: "Profile saved successfully!",
                type: "success",
            });
        }
    };

    // used for printing role out on screen
    const capitalize_first_letter = (str?: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    const cards = [
        { Component: PersonalInfoCard, key: "personal" },
        { Component: ContactInfoCard, key: "contact" },
        { Component: EmploymentInfoCard, key: "employment" },
    ];

    return (
        <div className="min-h-screen">
            <div className="flex">
                <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="flex items-start gap-4">
                            <EditableAvatar
                                editing={isEditing}
                                imageUrl={
                                    tempProfileImage ?? profile.profilePicture
                                }
                                onImageChange={async (file) => {
                                    const blobName = `${Date.now()}-${
                                        file.name
                                    }`; // gives it the time of creation for uniqueness (not sure if needed)

                                    const uploadedImage =
                                        await uploadFileHandler(file, blobName);

                                    if (!uploadedImage.success)
                                        throw new Error(
                                            "Upload failed or no URL returned"
                                        );

                                    const imageUrl =
                                        uploadedImage.url ?? tempProfileImage;

                                    setLocalProfile((prev) => ({
                                        ...prev,
                                        profilePicture: imageUrl,
                                    }));
                                    setProfileImage(imageUrl);
                                }}
                            />

                            <div className="mt-[10px]">
                                <h2 className="text-xl font-bold">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {capitalize_first_letter(
                                        userRole?.toString()
                                    )}{" "}
                                    since {formateDateToMonthYear(userSignUp)}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs bg-white text-black px-2 py-1 rounded-full border border-gray-400">
                                        Verified{" "}
                                        {capitalize_first_letter(
                                            userRole?.toString()
                                        )}{" "}
                                        {/*TODO: add switch statements to change nav bars based on users role i.e agent  */}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex gap-2 self-end md:self-auto">
                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={() =>
                                                dispatch(setEditing(false))
                                            }
                                            className="w-28 mt-1 hover:bg-gray-300 cursor-pointer transition"
                                        >
                                            Cancel Edit
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="w-28 mt-1 hover:bg-gray-300 cursor-pointer transition"
                                        >
                                            Save Profile
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            dispatch(setEditing(true))
                                        }
                                        className="w-28 mt-1 hover:bg-gray-300 cursor-pointer transition"
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                            {isEditing && (
                                <p className="text-sm font-medium text-gray-700 italic mt-2">
                                    * Indicates a mandatory field
                                </p>
                            )}
                        </div>
                    </div>

                    {notification && (
                        <div
                            className={`p-4 mb-6 rounded-md border ${
                                notification.type === "error"
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : "bg-green-50 border-green-200 text-green-700"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {notification.type === "success" ? (
                                        <CheckCircle className="h-5 w-5 mr-3" />
                                    ) : (
                                        <XCircle className="h-5 w-5 mr-3" />
                                    )}
                                    <p className="text-sm font-medium">
                                        {notification.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="opacity-70 hover:opacity-100"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {cards.map(({ Component, key }) => (
                            <Component
                                key={key}
                                profile={isEditing ? localProfile : profile}
                                isEditing={isEditing}
                                onChange={(field, value) => {
                                    setLocalProfile((prev) => ({
                                        ...prev,
                                        [field]: value,
                                    }));
                                    if (errors[field]) {
                                        setErrors((prev) => ({ ...prev, [field]: "" }));
                                    }
                                }}
                                errors={errors}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
