/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
  PropsWithChildren,
  MouseEvent,
  useState,
  useCallback,
} from 'react';
import {
  createNavItemExtension,
  useRouteRefResolver,
} from '@backstage/frontend-plugin-api';
import { SidebarItem as SidebarBaseItem } from '@backstage/core-components';

type SidebarItemProps = PropsWithChildren<
  Omit<(typeof createNavItemExtension.targetDataRef)['T'], 'routeRef'> & {
    routeRef?: (typeof createNavItemExtension.targetDataRef)['T']['routeRef'];
    onClick?: (event: MouseEvent) => void;
    modal?: (props: { open: boolean; handleClose: () => void }) => JSX.Element;
  }
>;

export function SidebarItem(props: SidebarItemProps) {
  const {
    icon: Icon,
    modal: Modal,
    title,
    routeRef,
    onClick,
    children,
  } = props;
  const resolveRouteRef = useRouteRefResolver();
  const to = resolveRouteRef(routeRef)?.();
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      onClick?.(event);
      if (Modal) {
        setOpen(prevOpen => !prevOpen);
      }
    },
    [Modal, onClick, setOpen],
  );

  return (
    <>
      <SidebarBaseItem to={to} icon={Icon} text={title} onClick={handleClick}>
        {children}
      </SidebarBaseItem>
      {Modal && <Modal open={open} handleClose={() => setOpen(false)} />}
    </>
  );
}
