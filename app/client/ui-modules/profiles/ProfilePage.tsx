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

export function ProfilePage(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfileData);
    const isEditing = useAppSelector(selectIsEditing);

    const [tempProfileImage, setProfileImage] = React.useState<string | null>(
        null
    );

    const [localProfile, setLocalProfile] = React.useState(profile);

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

    // in handle save, we can add validation for fields and cancel it if fields incorrect
    const handleSave = async () => {
        if (currentUser?.profileDataId) {
            const updated = await dispatch(
                saveProfileData({
                    id: currentUser.profileDataId,
                    profile: localProfile,
                })
            ).unwrap();
            dispatch(setCurrentProfileData(updated));
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
                <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
                    <div className="flex justify-between items-center">
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
                        <div className="flex gap-2 mt-1">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={() =>
                                            dispatch(setEditing(false))
                                        }
                                        className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                                    >
                                        Cancel Edit
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                                    >
                                        Save Profile
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => dispatch(setEditing(true))}
                                    className="w-32 mt-1 hover:bg-gray-300 cursor-pointer transition"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        {cards.map(({ Component, key }) => (
                            <Component
                                key={key}
                                profile={isEditing ? localProfile : profile}
                                isEditing={isEditing}
                                onChange={(field, value) =>
                                    setLocalProfile((prev) => ({
                                        ...prev,
                                        [field]: value,
                                    }))
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
