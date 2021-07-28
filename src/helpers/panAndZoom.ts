import { browser } from '$app/env';
import { asyncActionWrapper } from './asyncActionWrapper';

function noCrash(action: () => void, maxAttempts = 5)
{
    let crashed: boolean;
    let left = maxAttempts;
    do
    {
        try
        {
            action();
            crashed = false;
        } catch (e)
        {
            crashed = true;
            left--;
        }
    } while (crashed && left > 0);
}

export const panAndZoom = asyncActionWrapper(async (svg: SVGElement, _?: unknown) =>
{
    if (!browser)
    {
        return;
    }
    svg.style.display = 'inline';
    svg.style.height = svg.style.width = '100%';
    svg.style.maxWidth = svg.style.maxWidth = svg.style.minWidth = svg.style.minWidth = 'inherit';
    const { default: Hammer } = await import('hammerjs');
    const { default: svgPanZoom } = await import('svg-pan-zoom');
    let hammer: HammerManager;
    let initialScale = 1,
        pannedX = 0,
        pannedY = 0;
    let instance: SvgPanZoom.Instance;
    function setup()
    {
        hammer = new Hammer(svg);
        initialScale = 1;
        pannedX = 0;
        pannedY = 0;
        instance = svgPanZoom(svg, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            customEventsHandler: {
                destroy() { /* nothing todo */ },
                init() { svg.style.visibility = 'visible'; },
                haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
            }
        });
        hammer.get('pinch').set({ enable: true });
        hammer.on('doubletap', function (ev)
        {
            //instance.zoomIn();
        });
        hammer.on('panstart panmove', function (ev: HammerInput)
        {
            // On pan start reset panned variables
            if (ev.type === 'panstart')
            {
                pannedX = 0;
                pannedY = 0;
            }

            // Pan only the difference
            instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
            pannedX = ev.deltaX;
            pannedY = ev.deltaY;
        });

        // Handle pinch
        hammer.on('pinchstart pinchmove', function (ev)
        {
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart')
            {
                initialScale = instance.getZoom();
                instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y });
            }

            instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y });
        });

        svg.querySelectorAll('[data-seat]').forEach((s: SVGElement, i) =>
        {
            const title =
                s.querySelector('title') ?? document.createElementNS('http://www.w3.org/2000/svg', 'title');
            s.append(title);
            title.textContent = s.dataset.seat;
            s.classList.add(i % 3 === 0 ? 'available' : 'unavailable');
            s.addEventListener('click', (e: any) =>
            {
                alert(`Clicked on ${e.currentTarget.dataset.seat}`)
            });
        });
    }

    setup();

    // Prevent moving the page on some devices when panning over SVG
    svg.addEventListener('touchmove', function (e)
    {
        e.preventDefault();
    });

    function resize()
    {
        instance.resize().reset()
    }

    window.addEventListener('resize', resize, { passive: true });

    return {
        update()
        {
            noCrash(() => instance.destroy());
            noCrash(() => hammer.destroy());
            setup();
        },
        destroy()
        {
            noCrash(() => instance.destroy());
            noCrash(() => hammer.destroy());
            window.removeEventListener('resize', resize);
        }
    };
});