import { Meteor } from "meteor/meteor";
import { TenantApplicationCollection } from "../database/tenant/collections/TenantApplicationCollection";
import { Role } from "/app/shared/user-role-identifier";

// Publication for tenant applications based on user role and property
Meteor.publish("tenantApplications", function(role: Role, roleId: string, propertyId?: string) {
    if (!role || !roleId) {
      return this.ready();
    }

    const query: any = {};

    // Filter by property if provided
    if (propertyId) {
      query.propertyId = propertyId;
    }

    // Filter by user role
    if (role === Role.AGENT) {
      query.agentId = roleId;
    } else if (role === Role.LANDLORD) {
      query.landlordId = roleId;
    } else if (role === Role.TENANT) {
      query.tenantUserId = roleId;
    }

    const cursor = TenantApplicationCollection.find(query);
    return cursor;
});

// Publication for tenant application status updates only
Meteor.publish("tenantApplicationStatusUpdates", function(role: Role, roleId: string, propertyId?: string) {
    if (!role || !roleId) {
      return this.ready();
    }

    const query: any = {};

    if (propertyId) {
      query.propertyId = propertyId;
    }

    if (role === Role.AGENT) {
      query.agentId = roleId;
    } else if (role === Role.LANDLORD) {
      query.landlordId = roleId;
    } else if (role === Role.TENANT) {
      query.tenantUserId = roleId;
    }

    // Return applications with only essential fields for real-time updates
    return TenantApplicationCollection.find(query, {
      fields: {
        _id: 1,
        status: 1,
        step: 1,
        updatedAt: 1,
        propertyId: 1,
        applicantName: 1
      }
    });
  });


// Publication for new tenant applications (for notifications)
Meteor.publish("newTenantApplications", function(role: Role, roleId: string) {
    if (!role || !roleId) {
      return this.ready();
    }

    const query: any = {
      status: { $in: ['undetermined', 'accepted', 'landlord_review'] }
    };

    if (role === Role.AGENT) {
      query.agentId = roleId;
    } else if (role === Role.LANDLORD) {
      query.landlordId = roleId;
    }

    return TenantApplicationCollection.find(query, {
      fields: {
        _id: 1,
        propertyId: 1,
        applicantName: 1,
        status: 1,
        step: 1,
        createdAt: 1,
        updatedAt: 1
      }
    });
  });