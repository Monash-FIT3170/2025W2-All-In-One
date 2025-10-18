import { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from "meteor/mongo";
import { useAppDispatch, useAppSelector } from '/app/client/store';
import { Role } from '/app/shared/user-role-identifier';
import { TenantApplication } from '/app/client/library-modules/domain-models/tenant-application/TenantApplication';
import { TenantApplicationDocument } from '/app/server/database/tenant/models/TenantApplicationDocument';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant-application/TenantApplicationStatus';
import { setApplicationsFromSubscription } from '../state/reducers/tenant-selection-slice';
import { mapTenantApplicationDocumentToTenantApplication } from '/app/client/library-modules/domain-models/tenant-application/repositories/mappers/tenant-application-mapper';
// Client-side collection for tenant applications
// auto sync via Meteor's pub/sub system
const TenantApplicationCollection: Mongo.Collection<TenantApplicationDocument> = new Mongo.Collection("tenantApplications");

interface UseTenantApplicationSubscriptionsProps {
  enabled?: boolean;
  propertyId?: string;
  statusUpdatesOnly?: boolean;
}

// Hook for managing tenant application subscriptions and real-time updates
export function useTenantApplicationSubscriptions({
    enabled = true,
    propertyId,
    statusUpdatesOnly = false
  }: UseTenantApplicationSubscriptionsProps = {}) {
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector((state) => state.currentUser.currentUser);
    const authUser = useAppSelector((state) => state.currentUser.authUser);

    // Determine user role and ID
    let userRole: Role | undefined;
    let roleId: string | undefined;

    if (authUser && currentUser) {
      userRole = authUser.role;
      if (userRole === Role.AGENT && 'agentId' in currentUser) {
        roleId = currentUser.agentId;
      } else if (userRole === Role.TENANT && 'tenantId' in currentUser) {
        roleId = currentUser.tenantId;
      } else if (userRole === Role.LANDLORD && 'landlordId' in currentUser) {
        roleId = currentUser.landlordId;
      }
    }

    // Subscribe to tenant applications
    const applicationsReady = useTracker(() => {
      if (!enabled || !userRole || !roleId) {
        console.log('Subscription disabled or missing user info:', { enabled, userRole, roleId });
        return true;
      }

      const publicationName = statusUpdatesOnly ? 'tenantApplicationStatusUpdates' : 'tenantApplications';
      console.log('Subscribing to:', publicationName, { userRole, roleId, propertyId });
      const handle = Meteor.subscribe(publicationName, userRole, roleId, propertyId);
      const ready = handle.ready();
      console.log('Subscription ready:', ready);
      return ready;
    }, [enabled, userRole, roleId, propertyId, statusUpdatesOnly]);

    // Get applications from local collection (reactive)
    const applications = useTracker(() => {
      if (!applicationsReady || !userRole || !roleId) {
        console.log('Not fetching applications:', { applicationsReady, userRole, roleId });
        return [];
      }

      const query: any = {};

      if (propertyId) {
        query.propertyId = propertyId;
      }

      if (userRole === Role.AGENT) {
        query.agentId = roleId;
      } else if (userRole === Role.TENANT) {
        query.tenantUserId = roleId;
      } else if (userRole === Role.LANDLORD) {
        query.landlordId = roleId;
      }

      const fetchedApplications = TenantApplicationCollection.find(query).fetch();
      console.log('Fetched applications from collection:', fetchedApplications.length, query);
      return fetchedApplications;
    }, [applicationsReady, userRole, roleId, propertyId]);

    // Transform applications to domain model
    const transformedApplications: TenantApplication[] = applications.map(mapTenantApplicationDocumentToTenantApplication);

  // Track previous applications to prevent infinite loops
  const prevApplicationsRef = useRef<TenantApplication[]>([]);

  // Sync with Redux state when applications change
  useEffect(() => {
    console.log('useEffect triggered:', { propertyId, transformedApplicationsLength: transformedApplications.length });

    if (propertyId && transformedApplications.length > 0) {
      // Only update if applications actually changed
      const hasChanged =
        prevApplicationsRef.current.length !== transformedApplications.length ||
        prevApplicationsRef.current.some((prevApp, index) => {
          const currentApp = transformedApplications[index];
          return !currentApp || prevApp.id !== currentApp.id || prevApp.status !== currentApp.status;
        });

      console.log('Applications changed:', hasChanged, {
        prevLength: prevApplicationsRef.current.length,
        currentLength: transformedApplications.length
      });

      if (hasChanged) {
        prevApplicationsRef.current = transformedApplications;
        console.log('Dispatching to Redux:', transformedApplications);
        dispatch(setApplicationsFromSubscription({
          propertyId: propertyId,
          applications: transformedApplications
        }));
      }
    }
  }, [transformedApplications, propertyId, dispatch]);

  return {
    applicationsReady,
    applications: transformedApplications,
    isEnabled: enabled,
  };
}